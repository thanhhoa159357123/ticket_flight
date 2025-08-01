from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.chuyen_bay import ChuyenBay
from utils.spark import load_df, invalidate_cache
from utils.spark_views import cached_views
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import timedelta
import pandas as pd

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
chuyen_bay_collection = db["chuyen_bay"]

# 💡 Hàm kiểm tra mã tồn tại trong DataFrame
def check_exists(df, field_name, value) -> bool:
    return df.filter(df[field_name] == value).count() > 0

@router.post("", tags=["chuyen_bay"])
def add_chuyen_bay(chuyen_bay: ChuyenBay):
    try:
        print("📥 Nhận dữ liệu thêm chuyến bay:", chuyen_bay.dict())

        df_hang_bay = cached_views["hang_bay"]
        df_tuyen_bay = cached_views["tuyen_bay"]
        df_chuyen_bay = cached_views["chuyen_bay"]

        if not check_exists(df_hang_bay, "ma_hang_bay", chuyen_bay.ma_hang_bay):
            raise HTTPException(status_code=400, detail="Mã hãng bay không tồn tại")

        if not check_exists(df_tuyen_bay, "ma_tuyen_bay", chuyen_bay.ma_tuyen_bay):
            raise HTTPException(status_code=400, detail="Mã tuyến bay không tồn tại")

        if check_exists(df_chuyen_bay, "ma_chuyen_bay", chuyen_bay.ma_chuyen_bay):
            raise HTTPException(status_code=400, detail="Mã chuyến bay đã tồn tại")

        inserted = chuyen_bay_collection.insert_one(chuyen_bay.dict())
        invalidate_cache("chuyen_bay")

        inserted_data = chuyen_bay.dict()
        inserted_data["_id"] = str(inserted.inserted_id)
        inserted_data["gio_di"] = inserted_data["gio_di"].strftime("%d/%m/%Y, %H:%M:%S")
        inserted_data["gio_den"] = inserted_data["gio_den"].strftime("%d/%m/%Y, %H:%M:%S")

        print("✅ Đã thêm chuyến bay:", inserted_data["ma_chuyen_bay"])
        return JSONResponse(content={"message": "Thêm chuyến bay thành công", "chuyen_bay": inserted_data})

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi thêm chuyến bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["chuyen_bay"])
def get_all_chuyen_bay():
    try:
        spark = cached_views["chuyen_bay"].sparkSession

        # Tạo lại Temp View nếu cần JOIN
        cached_views["chuyen_bay"].createOrReplaceTempView("chuyen_bay")
        cached_views["tuyen_bay"].createOrReplaceTempView("tuyen_bay")
        cached_views["hang_bay"].createOrReplaceTempView("hang_bay")

        query = """
        SELECT 
            cb.ma_chuyen_bay, 
            cb.ma_tuyen_bay, 
            cb.ma_hang_bay, 
            cb.trang_thai,
            CAST(cb.gio_di AS STRING) AS gio_di, 
            CAST(cb.gio_den AS STRING) AS gio_den, 
            hb.ten_hang_bay
        FROM chuyen_bay cb
        LEFT JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        LEFT JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        """

        df = spark.sql(query)
        pdf = df.toPandas()

        if not pdf.empty:
            pdf["gio_di"] = (
                pd.to_datetime(pdf["gio_di"]) - timedelta(hours=7)
            ).dt.strftime("%d/%m/%Y, %H:%M:%S")
            pdf["gio_den"] = (
                pd.to_datetime(pdf["gio_den"]) - timedelta(hours=7)
            ).dt.strftime("%d/%m/%Y, %H:%M:%S")

        return JSONResponse(content=pdf.to_dict(orient="records"))

    except Exception as e:
        print("❌ Lỗi đọc danh sách chuyến bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
