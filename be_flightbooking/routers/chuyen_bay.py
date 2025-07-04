from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.chuyen_bay import ChuyenBay
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import timedelta
import pandas as pd

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
chuyen_bay_collection = db["chuyen_bay"]

@router.post("", tags=["chuyen_bay"])
def add_chuyen_bay(chuyen_bay: ChuyenBay):
    try:
        print("📥 Dữ liệu nhận từ client:", chuyen_bay.dict())

        df_hang_bay = load_df("hang_bay")
        df_tuyen_bay = load_df("tuyen_bay")
        df_chuyen_bay = load_df("chuyen_bay")

        # 💡 Check bằng DataFrame API
        if df_hang_bay.filter(df_hang_bay.ma_hang_bay == chuyen_bay.ma_hang_bay).count() == 0:
            raise HTTPException(status_code=400, detail="Mã hãng bay không tồn tại")

        if df_tuyen_bay.filter(df_tuyen_bay.ma_tuyen_bay == chuyen_bay.ma_tuyen_bay).count() == 0:
            raise HTTPException(status_code=400, detail="Mã tuyến bay không tồn tại")

        if df_chuyen_bay.filter(df_chuyen_bay.ma_chuyen_bay == chuyen_bay.ma_chuyen_bay).count() > 0:
            raise HTTPException(status_code=400, detail="Mã chuyến bay đã tồn tại")

        # ✅ Insert Mongo
        data_to_insert = chuyen_bay.dict()
        insert_result = chuyen_bay_collection.insert_one(data_to_insert)
        invalidate_cache("chuyen_bay")

        data_to_insert["_id"] = str(insert_result.inserted_id)
        data_to_insert["gio_di"] = data_to_insert["gio_di"].strftime("%d/%m/%Y, %H:%M:%S")
        data_to_insert["gio_den"] = data_to_insert["gio_den"].strftime("%d/%m/%Y, %H:%M:%S")

        print("✅ Thêm chuyến bay thành công:", data_to_insert["ma_chuyen_bay"])
        return JSONResponse(content={"message": "Thêm chuyến bay thành công", "chuyen_bay": data_to_insert})

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["chuyen_bay"])
def get_all_chuyen_bay():
    try:
        df_chuyen_bay = load_df("chuyen_bay")
        df_tuyen_bay = load_df("tuyen_bay")
        df_hang_bay = load_df("hang_bay")

        df_chuyen_bay.createOrReplaceTempView("chuyen_bay")
        df_tuyen_bay.createOrReplaceTempView("tuyen_bay")
        df_hang_bay.createOrReplaceTempView("hang_bay")

        spark = df_chuyen_bay.sparkSession

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

        df_result = spark.sql(query)
        pdf = df_result.toPandas()

        if len(pdf) > 0:
            pdf["gio_di"] = (
                pd.to_datetime(pdf["gio_di"]) - timedelta(hours=7)
            ).dt.strftime("%d/%m/%Y, %H:%M:%S")
            pdf["gio_den"] = (
                pd.to_datetime(pdf["gio_den"]) - timedelta(hours=7)
            ).dt.strftime("%d/%m/%Y, %H:%M:%S")

        return JSONResponse(content=pdf.to_dict(orient="records"))

    except Exception as e:
        print("❌ Lỗi khi đọc dữ liệu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
