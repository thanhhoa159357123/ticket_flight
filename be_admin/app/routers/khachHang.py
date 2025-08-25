from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from utils.spark import load_df, invalidate_cache
from utils.env_loader import DATA_MONGO_DB, DATA_MONGO_URI
from pymongo import MongoClient
from datetime import datetime, timezone
import traceback

router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
khach_hang_collection = client[DATA_MONGO_DB]["khachhang"]

@router.get("", tags=["khachhang"])
def get_all_khach_hang():
    try:
        df = load_df("khachhang")
        df = df.select(
            "ten_khach_hang", "email", "so_dien_thoai", "ma_khach_hang",
            "is_active", "da_dat_ve", "created_at", "last_active_at", "deleted_at"
        )
        result = df.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/{ma_khach_hang}", tags=["khachhang"])
def get_khach_hang_by_id(ma_khach_hang: str):
    try:
        print(f"🔍 Tìm kiếm khách hàng theo mã: {ma_khach_hang}")
        kh = khach_hang_collection.find_one({"ma_khach_hang": ma_khach_hang})

        if not kh:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")

        kh["_id"] = str(kh["_id"])  # convert ObjectId
        return JSONResponse(content=kh)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.put("/{ma_khach_hang}", tags=["khachhang"])
def update_khach_hang(ma_khach_hang: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Yêu cầu cập nhật khách hàng: {ma_khach_hang}, dữ liệu: {updated_data}")

        existing = khach_hang_collection.find_one({"ma_khach_hang": ma_khach_hang})
        if not existing:
            raise HTTPException(status_code=404, detail="Khách hàng không tồn tại")

        updated_data.pop("ma_khach_hang", None)  # Không cho phép sửa mã
        updated_data["last_active_at"] = datetime.now(timezone.utc).isoformat()

        result = khach_hang_collection.update_one(
            {"ma_khach_hang": ma_khach_hang},
            {"$set": updated_data}
        )

        invalidate_cache("khachhang")

        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào được thực hiện"})

        return JSONResponse(content={"message": f"Cập nhật khách hàng {ma_khach_hang} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.delete("/{ma_khach_hang}", tags=["khachhang"])
def delete_khach_hang(ma_khach_hang: str):
    try:
        print(f"🗑 Yêu cầu xoá khách hàng: {ma_khach_hang}")
        result = khach_hang_collection.delete_one({"ma_khach_hang": ma_khach_hang})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng cần xoá")

        invalidate_cache("khachhang")

        return JSONResponse(content={"message": f"Đã xoá khách hàng {ma_khach_hang} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
