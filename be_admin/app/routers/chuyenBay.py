from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.chuyen_bay import ChuyenBay
from utils.spark import load_df, invalidate_cache
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB
from pymongo import MongoClient
from datetime import datetime
import traceback
import pandas as pd
from pyspark.sql.functions import col, date_format
router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
chuyen_bay_collection = client[DATA_MONGO_DB]["chuyen_bay"]

@router.post("", tags=["chuyen_bay"])
def add_chuyen_bay(chuyen_bay: ChuyenBay):
    try:
        print("📥 Dữ liệu nhận từ client:", chuyen_bay.dict())

        df = load_df("chuyen_bay")

        if (
            "ma_chuyen_bay" in df.columns
            and df.filter(df["ma_chuyen_bay"] == chuyen_bay.ma_chuyen_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Chuyến bay đã tồn tại")

        data_to_insert = chuyen_bay.dict()
        inserted = chuyen_bay_collection.insert_one(data_to_insert)

        invalidate_cache("chuyen_bay")
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm chuyến bay thành công", "chuyen_bay": data_to_insert}
        )

    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["chuyen_bay"])
def get_all_chuyen_bay():
    try:
        df = load_df("chuyen_bay")
        df = df.select("ma_chuyen_bay", "gio_di", "gio_den", "trang_thai", "ma_hang_bay", "ma_tuyen_bay")

        df = df.withColumn("gio_di", date_format(col("gio_di"), "yyyy-MM-dd HH:mm:ss"))
        df = df.withColumn("gio_den", date_format(col("gio_den"), "yyyy-MM-dd HH:mm:ss"))

        pd_df = df.toPandas()

        # ép kiểu datetime
        pd_df["gio_di"] = pd.to_datetime(pd_df["gio_di"].astype(str), errors="coerce")
        pd_df["gio_den"] = pd.to_datetime(pd_df["gio_den"].astype(str), errors="coerce")

        # ⭐️ Chuyển thành chuỗi trước khi trả JSON
        pd_df["gio_di"] = pd_df["gio_di"].dt.strftime("%Y-%m-%d %H:%M:%S")
        pd_df["gio_den"] = pd_df["gio_den"].dt.strftime("%Y-%m-%d %H:%M:%S")

        result = pd_df.to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong get_all_chuyen_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.put("/{ma_chuyen_bay}", tags=["chuyen_bay"])
def update_chuyen_bay(ma_chuyen_bay: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Nhận yêu cầu cập nhật chuyến bay: {ma_chuyen_bay}, dữ liệu: {updated_data}")

        existing = chuyen_bay_collection.find_one({"ma_chuyen_bay": ma_chuyen_bay})
        if not existing:
            raise HTTPException(status_code=404, detail="Chuyến bay không tồn tại")

        if "ma_chuyen_bay" in updated_data:
            updated_data.pop("ma_chuyen_bay")

        result = chuyen_bay_collection.update_one(
            {"ma_chuyen_bay": ma_chuyen_bay},
            {"$set": updated_data}
        )
        invalidate_cache("chuyen_bay")

        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào được thực hiện"})

        return JSONResponse(content={"message": f"Cập nhật chuyến bay {ma_chuyen_bay} thành công"})

    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /update:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_chuyen_bay}", tags=["chuyen_bay"])
def delete_chuyen_bay(ma_chuyen_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá chuyến bay: {ma_chuyen_bay}")

        result = chuyen_bay_collection.delete_one({"ma_chuyen_bay": ma_chuyen_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy chuyến bay cần xoá")

        invalidate_cache("chuyen_bay")

        return JSONResponse(content={"message": f"Đã xoá chuyến bay {ma_chuyen_bay} thành công"})

    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


if __name__ == "__main__":
    print("✅ Router chuyenBay đã sẵn sàng")