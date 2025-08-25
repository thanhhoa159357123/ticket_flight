from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.chuyen_bay import ChuyenBay
from utils.spark import load_df, invalidate_cache, refresh_cache
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB
from pyspark.sql import functions as F
from pymongo import MongoClient
from datetime import datetime
import traceback
import pandas as pd
from dateutil import parser

router = APIRouter()

# ===========================
# Kết nối MongoDB
# ===========================
client = MongoClient(DATA_MONGO_URI)
chuyen_bay_collection = client[DATA_MONGO_DB]["chuyenbay"]


def check_chuyen_bay_exists(ma_chuyen_bay: str) -> bool:
    """Kiểm tra chuyến bay có tồn tại trong cache Spark"""
    try:
        df = load_df("chuyenbay")
        return df.filter(df["ma_chuyen_bay"] == ma_chuyen_bay).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_chuyen_bay_exists: {e}")
        return False


# ===========================
# POST: Thêm chuyến bay
# ===========================
@router.post("", tags=["chuyenbay"])
def add_chuyen_bay(chuyen_bay: ChuyenBay):
    try:
        print("📥 Nhận dữ liệu từ client:", chuyen_bay.dict())

        if check_chuyen_bay_exists(chuyen_bay.ma_chuyen_bay):
            raise HTTPException(status_code=400, detail="Chuyến bay đã tồn tại")

        data_to_insert = chuyen_bay.dict()

        # ✅ Convert string → datetime cho các field thời gian
        for field in ["thoi_gian_di", "thoi_gian_den"]:
            if field in data_to_insert and isinstance(data_to_insert[field], str):
                try:
                    data_to_insert[field] = parser.isoparse(data_to_insert[field])
                except Exception:
                    data_to_insert[field] = None  # hoặc có thể raise lỗi 400 tùy logic

        inserted = chuyen_bay_collection.insert_one(data_to_insert)

        invalidate_cache("chuyenbay")
        print("🎉 Thêm chuyến bay thành công:", chuyen_bay.ma_chuyen_bay)

        data_to_insert["_id"] = str(inserted.inserted_id)
        return JSONResponse(
            content={"message": "Thêm chuyến bay thành công", "chuyenbay": data_to_insert}
        )

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong add_chuyen_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ===========================
# GET: Lấy tất cả chuyến bay
# ===========================
@router.get("", response_model=list[ChuyenBay], tags=["chuyenbay"])
async def get_all_chuyen_bay():
    try:
        # Ép cột thời gian về timestamp trong Spark (an toàn nếu còn bản ghi kiểu string/null)
        df = load_df("chuyenbay").select(
            "ma_chuyen_bay",
            F.col("thoi_gian_di").cast("timestamp").alias("thoi_gian_di"),
            F.col("thoi_gian_den").cast("timestamp").alias("thoi_gian_den"),
            "ma_hang_bay",
            "ma_san_bay_di",
            "ma_san_bay_den",
        )

        rows = df.collect()

        # Trả về list[dict] đúng shape của ChuyenBay; datetime -> ISO string để JSON hóa
        records = []
        for r in rows:
            di = r["thoi_gian_di"]
            den = r["thoi_gian_den"]
            records.append({
                "ma_chuyen_bay": r["ma_chuyen_bay"],
                "thoi_gian_di": di.isoformat() if isinstance(di, datetime) else None,
                "thoi_gian_den": den.isoformat() if isinstance(den, datetime) else None,
                "ma_hang_bay": r["ma_hang_bay"],
                "ma_san_bay_di": r["ma_san_bay_di"],
                "ma_san_bay_den": r["ma_san_bay_den"],
            })

        # response_model=list[ChuyenBay] → Pydantic tự parse ISO string về datetime
        return records

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy dữ liệu: {str(e)}")
    
# ===========================
# PUT: Cập nhật chuyến bay
# ===========================
@router.put("/{ma_chuyen_bay}", tags=["chuyenbay"])
def update_chuyen_bay(ma_chuyen_bay: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Yêu cầu cập nhật chuyến bay {ma_chuyen_bay} với dữ liệu: {updated_data}")

        existing = chuyen_bay_collection.find_one({"ma_chuyen_bay": ma_chuyen_bay})
        if not existing:
            raise HTTPException(status_code=404, detail="Chuyến bay không tồn tại")

        # Không cho đổi mã chuyến bay
        updated_data.pop("ma_chuyen_bay", None)

        # Convert thời gian từ string -> datetime nếu có
        for field in ["thoi_gian_di", "thoi_gian_den"]:
            if field in updated_data and isinstance(updated_data[field], str):
                try:
                    updated_data[field] = parser.isoparse(updated_data[field])
                except Exception:
                    updated_data[field] = None  # hoặc bỏ qua

        # Merge dữ liệu cũ + mới
        new_data = {**existing, **updated_data}
        new_data.pop("_id", None)

        result = chuyen_bay_collection.update_one(
            {"ma_chuyen_bay": ma_chuyen_bay},
            {"$set": new_data}
        )

        refresh_cache("chuyenbay")

        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào được thực hiện"})

        return JSONResponse(content={"message": f"Cập nhật chuyến bay {ma_chuyen_bay} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ===========================
# DELETE: Xoá chuyến bay
# ===========================
@router.delete("/{ma_chuyen_bay}", tags=["chuyenbay"])
def delete_chuyen_bay(ma_chuyen_bay: str):
    try:
        print(f"🗑 Yêu cầu xoá chuyến bay: {ma_chuyen_bay}")

        if not check_chuyen_bay_exists(ma_chuyen_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy chuyến bay")

        result = chuyen_bay_collection.delete_one({"ma_chuyen_bay": ma_chuyen_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy chuyến bay cần xoá")

        refresh_cache("chuyenbay")

        return JSONResponse(content={"message": f"Đã xoá chuyến bay {ma_chuyen_bay} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong delete_chuyen_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ===========================
# GET: Lấy chuyến bay sắp tới
# ===========================

@router.get("/upcoming", tags=["chuyenbay"])
async def get_upcoming_chuyen_bay():
    try:
        now = datetime.now()

        df = load_df("chuyenbay").select(
            "ma_chuyen_bay",
            F.col("thoi_gian_di").cast("timestamp").alias("thoi_gian_di"),
            F.col("thoi_gian_den").cast("timestamp").alias("thoi_gian_den"),
            "ma_hang_bay",
            "ma_san_bay_di",
            "ma_san_bay_den",
        )

        # lọc các chuyến có thời gian đi > hiện tại
        df_filtered = df.filter(F.col("thoi_gian_di") > F.lit(now))

        rows = df_filtered.orderBy("thoi_gian_di").collect()

        records = []
        for r in rows:
            records.append({
                "ma_chuyen_bay": r["ma_chuyen_bay"],
                "thoi_gian_di": r["thoi_gian_di"].isoformat() if r["thoi_gian_di"] else None,
                "thoi_gian_den": r["thoi_gian_den"].isoformat() if r["thoi_gian_den"] else None,
                "ma_hang_bay": r["ma_hang_bay"],
                "ma_san_bay_di": r["ma_san_bay_di"],
                "ma_san_bay_den": r["ma_san_bay_den"],
            })

        return {"total": len(records), "data": records}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy chuyến bay sắp tới: {str(e)}")


if __name__ == "__main__":
    print("✅ Router chuyenbay đã sẵn sàng")
