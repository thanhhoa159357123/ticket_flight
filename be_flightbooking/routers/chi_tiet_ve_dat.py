# routers/chi_tiet_ve_dat.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.chi_tiet_ve_dat import ChiTietVeDat
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
 
router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
chi_tiet_ve_dat_collection = db["chi_tiet_ve_dat"]
hanh_khach_collection = db["hanh_khach"]

@router.post("", tags=["chi_tiet_ve_dat"])
def add_chi_tiet_ve_dat(payload: ChiTietVeDat):
    try:
        print("🚀 Nhận dữ liệu chi tiết đặt vé:", payload.dict())

        df_dat_ve = load_df("dat_ve")
        df_gia_ve = load_df("gia_ve")

        # ⚠️ Kiểm tra ràng buộc khóa ngoại
        if df_dat_ve.filter(df_dat_ve.ma_dat_ve == payload.ma_dat_ve).count() == 0:
            raise HTTPException(status_code=400, detail="Mã đặt vé không tồn tại")

        # ✅ Kiểm tra tất cả ma_gia_ve có tồn tại không
        ma_gia_ve_list = payload.ma_gia_ve
        print(f"📋 Danh sách giá vé cần kiểm tra: {ma_gia_ve_list}")
        
        for ma_gv in ma_gia_ve_list:
            if df_gia_ve.filter(df_gia_ve.ma_gia_ve == ma_gv).count() == 0:
                raise HTTPException(status_code=400, detail=f"Mã giá vé {ma_gv} không tồn tại")

        # ✅ Lấy danh sách hành khách
        ma_hanh_khach_list = payload.ma_hanh_khach
        print(f"📝 Danh sách hành khách cần thêm: {ma_hanh_khach_list}")

        # ✅ Kiểm tra tất cả hành khách có tồn tại không
        for ma_hk in ma_hanh_khach_list:
            if hanh_khach_collection.count_documents({"ma_hanh_khach": ma_hk}) == 0:
                raise HTTPException(status_code=400, detail=f"Hành khách {ma_hk} không tồn tại")

        # 🔄 Tạo records cho từng ma_gia_ve (vé một chiều = 1 record, vé khứ hồi = 2 records)
        created_records = []
        
        for ma_gia_ve in ma_gia_ve_list:
            # 🔒 Sử dụng upsert với $addToSet để tránh race condition
            query = {
                "ma_dat_ve": payload.ma_dat_ve,
                "ma_gia_ve": ma_gia_ve  # Mỗi ma_gia_ve sẽ có 1 document riêng
            }
            
            update_operation = {
                "$addToSet": {
                    "ma_hanh_khach": {"$each": ma_hanh_khach_list}  # $addToSet tự động loại bỏ trùng lặp
                },
                "$setOnInsert": {
                    "ma_dat_ve": payload.ma_dat_ve,
                    "ma_gia_ve": ma_gia_ve
                }
            }
            
            print(f"🔍 Upsert cho ma_gia_ve {ma_gia_ve} với query: {query}")
            
            result = chi_tiet_ve_dat_collection.update_one(
                query,
                update_operation,
                upsert=True  # Tạo mới nếu chưa tồn tại
            )
            
            # Lấy record sau khi upsert
            record = chi_tiet_ve_dat_collection.find_one(query)
            record["_id"] = str(record["_id"])
            created_records.append(record)
            
            if result.upserted_id:
                print(f"✅ Đã tạo record mới cho {ma_gia_ve}:", record)
            else:
                print(f"✅ Đã cập nhật record cho {ma_gia_ve}:", record)

        invalidate_cache("chi_tiet_ve_dat")

        return JSONResponse(
            content={
                "message": f"Tạo chi tiết vé đặt thành công cho {len(ma_gia_ve_list)} giá vé",
                "chi_tiet_ve_list": created_records,
                "summary": {
                    "ma_dat_ve": payload.ma_dat_ve,
                    "so_gia_ve": len(ma_gia_ve_list),
                    "so_hanh_khach": len(ma_hanh_khach_list),
                    "loai_ve": "Khứ hồi" if len(ma_gia_ve_list) == 2 else "Một chiều"
                }
            }
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/by-ma-dat-ve/{ma_dat_ve}", tags=["chi_tiet_ve_dat"])
def get_chi_tiet_ve_by_ma_dat_ve(ma_dat_ve: str):
    try:
        chi_tiet_list = list(chi_tiet_ve_dat_collection.find({"ma_dat_ve": ma_dat_ve}))
        for item in chi_tiet_list:
            item["_id"] = str(item["_id"])
        
        # ✅ Thêm thông tin tổng hợp
        summary = {
            "ma_dat_ve": ma_dat_ve,
            "so_records": len(chi_tiet_list),
            "danh_sach_gia_ve": [item["ma_gia_ve"] for item in chi_tiet_list],
            "loai_ve": "Khứ hồi" if len(chi_tiet_list) == 2 else "Một chiều"
        }
        
        return {
            "chi_tiet_ve_list": chi_tiet_list,
            "summary": summary
        }
        
    except Exception as e:
        print("❌ Lỗi khi lấy chi tiết vé theo mã đặt vé:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.delete("/cleanup/{ma_dat_ve}", tags=["chi_tiet_ve_dat"])
def cleanup_duplicate_records(ma_dat_ve: str):
    """Xóa tất cả records của ma_dat_ve để test lại"""
    try:
        result = chi_tiet_ve_dat_collection.delete_many({"ma_dat_ve": ma_dat_ve})
        return {"message": f"Đã xóa {result.deleted_count} records", "ma_dat_ve": ma_dat_ve}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))