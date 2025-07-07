from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.gia_ve import GiaVe
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pyspark.sql.functions import col
import pandas as pd

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
gia_ve_collection = db["gia_ve"]


@router.post("", tags=["gia_ve"])
def add_gia_ve(gia_ve: GiaVe):
    try:
        print("📥 Dữ liệu nhận từ client:", gia_ve.dict())

        df_gia_ve = load_df("gia_ve")
        df_hang_ve = load_df("hang_ve")
        df_chuyen_bay = load_df("chuyen_bay")
        df_hang_ban_ve = load_df("hang_ban_ve")
        df_loai_chuyen_di = load_df("loai_chuyen_di")

        df_gia_ve.printSchema()

        # 💡 Check bằng DataFrame API
        if df_hang_ve.filter(df_hang_ve.ma_hang_ve == gia_ve.ma_hang_ve).count() == 0:
            raise HTTPException(status_code=400, detail="Mã hạng vé không tồn tại")

        if (
            df_chuyen_bay.filter(
                df_chuyen_bay.ma_chuyen_bay == gia_ve.ma_chuyen_bay
            ).count()
            == 0
        ):
            raise HTTPException(status_code=400, detail="Mã chuyến bay không tồn tại")

        if (
            df_hang_ban_ve.filter(
                df_hang_ban_ve.ma_hang_ban_ve == gia_ve.ma_hang_ban_ve
            ).count()
            == 0
        ):
            raise HTTPException(status_code=400, detail="Mã hạng bán vé không tồn tại")

        if (
            df_loai_chuyen_di.filter(
                df_loai_chuyen_di.ma_chuyen_di == gia_ve.ma_chuyen_di
            ).count()
            == 0
        ):
            raise HTTPException(
                status_code=400, detail="Mã loại chuyến đi không tồn tại"
            )
        # ✅ Check mã giá vé chỉ nếu column tồn tại
        if "ma_gia_ve" in df_gia_ve.columns:
            if df_gia_ve.filter(df_gia_ve["ma_gia_ve"] == gia_ve.ma_gia_ve).count() > 0:
                raise HTTPException(status_code=400, detail="Mã giá vé đã tồn tại")

        # ✅ Insert Mongo
        data_to_insert = gia_ve.dict()
        insert_result = gia_ve_collection.insert_one(data_to_insert)
        invalidate_cache("gia_ve")

        data_to_insert["_id"] = str(insert_result.inserted_id)

        print("✅ Thêm giá vé thành công:", data_to_insert["ma_gia_ve"])
        return JSONResponse(
            content={"message": "Thêm giá vé thành công", "gia_ve": data_to_insert}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["gia_ve"])
def get_all_gia_ve():
    try:
        df_gia_ve = load_df("gia_ve")
        df_hang_ve = load_df("hang_ve")
        df_chuyen_bay = load_df("chuyen_bay")
        df_hang_ban_ve = load_df("hang_ban_ve")
        df_loai_chuyen_di = load_df("loai_chuyen_di")

        df_gia_ve.createOrReplaceTempView("gia_ve")
        df_hang_ve.createOrReplaceTempView("hang_ve")
        df_chuyen_bay.createOrReplaceTempView("chuyen_bay")
        df_hang_ban_ve.createOrReplaceTempView("hang_ban_ve")
        df_loai_chuyen_di.createOrReplaceTempView("loai_chuyen_di")

        spark = df_gia_ve.sparkSession

        query = """
        SELECT 
            gv.ma_gia_ve, 
            gv.gia, 
            gv.ma_hang_ve, 
            gv.ma_chuyen_bay, 
            gv.ma_hang_ban_ve, 
            gv.ma_chuyen_di,
            hv.vi_tri_ngoi,
            cb.ma_chuyen_bay,
            hbv.ten_hang_ban_ve,
            lcd.ten_chuyen_di
        FROM gia_ve gv
        LEFT JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN loai_chuyen_di lcd ON gv.ma_chuyen_di = lcd.ma_chuyen_di
        """

        result_df = spark.sql(query)
        pdf = result_df.toPandas()

        return JSONResponse(content=pdf.to_dict(orient="records"))

    except Exception as e:
        print("❌ Lỗi khi đọc dữ liệu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
