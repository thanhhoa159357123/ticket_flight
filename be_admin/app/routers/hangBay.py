from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.hang_bay import HangBay
from utils.spark import load_df, invalidate_cache,refresh_cache
from utils.env_loader import DATA_MONGO_DB, DATA_MONGO_URI
from pymongo import MongoClient
import traceback

router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
hang_bay_collection = client[DATA_MONGO_DB]["hangbay"]


def check_hang_bay_exists(ma_hang_bay: str) -> bool:
    """Optimized function to check if airline exists using cache"""
    try:
        df = load_df("hangbay")
        return df.filter(df["ma_hang_bay"] == ma_hang_bay).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_hang_bay_exists: {e}")
        return False
# ===========================
# POST: Thêm hãng bay
# ===========================
@router.post("", tags=["hangbay"])
def add_hang_bay(hang_bay: HangBay):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_bay.dict())

        df = load_df("hangbay")

        # Kiểm tra trùng mã
        if (
            "ma_hang_bay" in df.columns
            and df.filter(df["ma_hang_bay"] == hang_bay.ma_hang_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bay đã tồn tại")

        data_to_insert = hang_bay.dict()
        inserted = hang_bay_collection.insert_one(data_to_insert)

        invalidate_cache("hangbay")
        print("🎉 Thêm hãng bay thành công:", hang_bay.ma_hang_bay)

        # Trả về dữ liệu kèm _id
        data_to_insert["_id"] = str(inserted.inserted_id)
        return JSONResponse(
            content={"message": "Thêm hãng bay thành công", "hangbay": data_to_insert}
        )

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ===========================
# GET: Lấy tất cả hãng bay
# ===========================
@router.get("", tags=["hangbay"])
def get_all_hang_bay():
    try:
        df = load_df("hangbay")
        df = df.select("ma_hang_bay", "ten_hang_bay", "iata_code", "quoc_gia")

        result = df.toPandas().to_dict(orient="records")

        if not result:
            return JSONResponse(content={"message": "Không có hãng bay nào"})
        return JSONResponse(content=result)

    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong get_all_hang_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ===========================
# PUT: Cập nhật hãng bay
# ===========================
@router.put("/{ma_hang_bay}", tags=["hangbay"])
def update_hang_bay(ma_hang_bay: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Nhận yêu cầu cập nhật hãng bay: {ma_hang_bay}, dữ liệu: {updated_data}")

        existing_hang_bay = hang_bay_collection.find_one({"ma_hang_bay": ma_hang_bay})
        if not existing_hang_bay:
            raise HTTPException(status_code=404, detail="Hãng bay không tồn tại")

        # Không cho phép đổi mã hãng bay
        if "ma_hang_bay" in updated_data:
            updated_data.pop("ma_hang_bay")

        # Merge dữ liệu cũ với mới
        new_data = {**existing_hang_bay, **updated_data}
        # Loại bỏ _id gốc để tránh lỗi update
        if "_id" in new_data:
            new_data.pop("_id")

        result = hang_bay_collection.update_one(
            {"ma_hang_bay": ma_hang_bay},
            {"$set": new_data}
        )

        invalidate_cache("hangbay")

        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào được thực hiện"})

        return JSONResponse(content={"message": f"Cập nhật hãng bay {ma_hang_bay} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /update:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ===========================
# DELETE: Xoá hãng bay
# ===========================
@router.delete("/{ma_hang_bay}", tags=["hangbay"])
def delete_hang_bay(ma_hang_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá hãng bay: {ma_hang_bay}")
        if not check_hang_bay_exists(ma_hang_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay")
        result = hang_bay_collection.delete_one({"ma_hang_bay": ma_hang_bay})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay cần xoá")

        refresh_cache("hangbay")

        return JSONResponse(content={"message": f"Đã xoá hãng bay {ma_hang_bay} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
