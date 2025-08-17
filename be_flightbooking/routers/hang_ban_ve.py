from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hangbanve import HangBanVe
from utils.spark import load_df, refresh_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_ban_ve_collection = client[MONGO_DB]["hangbanve"]

@router.post("", tags=["hangbanve"])
def add_hang_ban_ve(hang_ban_ve: HangBanVe):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_ban_ve.dict())

        # Kiểm tra tồn tại với cached DataFrame
        df = load_df("hangbanve")
        if (
            "ma_hang_ban_ve" in df.columns
            and df.filter(df["ma_hang_ban_ve"] == hang_ban_ve.ma_hang_ban_ve).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bán vé đã tồn tại")

        # Insert với error handling
        data_to_insert = hang_ban_ve.dict()
        try:
            inserted = hang_ban_ve_collection.insert_one(data_to_insert)
            if not inserted.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm hãng bán vé")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã hãng bán vé đã tồn tại")

        # Refresh cache để có dữ liệu mới ngay lập tức
        refresh_cache("hangbanve")
        
        data_to_insert["_id"] = str(inserted.inserted_id)
        print("🎉 Thêm hãng bán vé thành công:", hang_ban_ve.ma_hang_ban_ve)
        
        return JSONResponse(
            content={
                "message": "Thêm hãng bán vé thành công", 
                "data": data_to_insert
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Lỗi trong add_hang_ban_ve:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["hangbanve"])
def get_all_hang_ban_ve():
    try:
        # Sử dụng cached DataFrame với select tối ưu
        df = load_df("hangbanve")
        df = df.select("ma_hang_ban_ve", "ten_hang_ban_ve", "vai_tro")
        result = df.toPandas().to_dict(orient="records")
        
        print(f"✅ Lấy danh sách hãng bán vé thành công: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_hang_ban_ve:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    
@router.delete("/{ma_hang_ban_ve}", tags=["hangbanve"])
def delete_hang_ban_ve(ma_hang_ban_ve: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_hang_ban_ve}")

        result = hang_ban_ve_collection.delete_one({"ma_hang_ban_ve": ma_hang_ban_ve})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay cần xoá")
        refresh_cache("hangbanve")
        return JSONResponse(content={"message": f"Đã xoá tuyến bay {ma_hang_ban_ve} thành công"})
        
    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
