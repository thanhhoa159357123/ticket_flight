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
chi_tiet_ve_dat_collection = db["chitietdatve"]
hanh_khach_collection = db["hanhkhach"]


@router.post("", tags=["chi_tiet_ve_dat"])
def add_chi_tiet_ve_dat(payload: ChiTietVeDat):
    try:
        print("🚀 Nhận dữ liệu chi tiết đặt vé:", payload.dict())

        df_dat_ve = load_df("datve")
        df_gia_ve = load_df("ve")

        # Kiểm tra mã đặt vé tồn tại
        if df_dat_ve.filter(df_dat_ve["ma_dat_ve"] == payload.ma_dat_ve).count() == 0:
            raise HTTPException(status_code=400, detail="Mã đặt vé không tồn tại")

        ma_ve_list = payload.ma_ve if isinstance(payload.ma_ve, list) else [payload.ma_ve]
        ma_hanh_khach_list = payload.ma_hanh_khach if isinstance(payload.ma_hanh_khach, list) else [payload.ma_hanh_khach]

        record = {
            "ma_dat_ve": payload.ma_dat_ve,
            "ma_ve": ma_ve_list,
            "ma_hanh_khach": ma_hanh_khach_list
        }
        result = chi_tiet_ve_dat_collection.insert_one(record)
        record["_id"] = str(result.inserted_id)
        created_records = [record]

        print(f"✅ Đã tạo 1 record duy nhất cho tất cả mã vé:", record)


        invalidate_cache("chitietdatve")

        return JSONResponse(
            content={
                "message": f"Tạo chi tiết vé đặt thành công cho {len(ma_ve_list)} giá vé",
                "chi_tiet_ve_list": created_records,
                "summary": {
                    "ma_dat_ve": payload.ma_dat_ve,
                    "so_gia_ve": len(ma_ve_list),
                    "so_hanh_khach": len(ma_hanh_khach_list),
                    "loai_ve": "Khứ hồi" if len(ma_ve_list) == 2 else "Một chiều",
                },
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
        
        # Sửa tên trường cho đúng với dữ liệu thực tế
        summary = {
            "ma_dat_ve": ma_dat_ve,
            "so_records": len(chi_tiet_list),
            "danh_sach_gia_ve": [item.get("ma_ve") for item in chi_tiet_list],
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
        return {
            "message": f"Đã xóa {result.deleted_count} records",
            "ma_dat_ve": ma_dat_ve,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
