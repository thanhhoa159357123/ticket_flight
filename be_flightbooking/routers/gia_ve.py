from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.gia_ve import GiaVe
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pyspark.sql.functions import col
import pandas as pd
import traceback

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
        df_chuyen_bay = load_df("chuyen_bay")
        df_tuyen_bay = load_df("tuyen_bay")
        df_hang_ve = load_df("hang_ve")
        df_hang_ban_ve = load_df("hang_ban_ve")
        df_loai_chuyen_di = load_df("loai_chuyen_di")
        df_hang_bay = load_df("hang_bay")
        df_san_bay = load_df("san_bay")

        # Register temp views
        df_gia_ve.createOrReplaceTempView("gia_ve")
        df_chuyen_bay.createOrReplaceTempView("chuyen_bay")
        df_tuyen_bay.createOrReplaceTempView("tuyen_bay")
        df_hang_ve.createOrReplaceTempView("hang_ve")
        df_hang_ban_ve.createOrReplaceTempView("hang_ban_ve")
        df_loai_chuyen_di.createOrReplaceTempView("loai_chuyen_di")
        df_hang_bay.createOrReplaceTempView("hang_bay")
        df_san_bay.createOrReplaceTempView("san_bay")

        spark = df_gia_ve.sparkSession

        query = """
        SELECT 
            gv.*,
            CAST(cb.gio_di AS STRING) AS gio_di,
            CAST(cb.gio_den AS STRING) AS gio_den,
            cb.ma_tuyen_bay,
            cb.ma_hang_bay,
            tb.ma_san_bay_di,
            tb.ma_san_bay_den,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den,
            hv.vi_tri_ngoi,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hbv.vai_tro,
            lcd.ten_chuyen_di,
            lcd.mo_ta,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN loai_chuyen_di lcd ON gv.ma_chuyen_di = lcd.ma_chuyen_di
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE NOT gv.ma_gia_ve RLIKE '\\\\+'
        """

        result_df = spark.sql(query)
        pdf = result_df.toPandas()

        return JSONResponse(content=pdf.to_dict(orient="records"))

    except Exception as e:
        print("❌ Lỗi khi đọc dữ liệu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


import re


@router.get("/search-ve", tags=["gia_ve"])
def search_ve(
    from_airport: str, to_airport: str, loai_chuyen_di: str, vi_tri_ngoi: str
):
    try:
        # 🔐 Escape chuỗi đầu vào
        safe_from = from_airport.replace("'", "''")
        safe_to = to_airport.replace("'", "''")
        safe_loai = loai_chuyen_di.replace("'", "''")
        safe_vi_tri = vi_tri_ngoi.replace("'", "''")
        escaped_vi_tri = re.escape(vi_tri_ngoi)

        df_gia_ve = load_df("gia_ve")
        df_chuyen_bay = load_df("chuyen_bay")
        df_tuyen_bay = load_df("tuyen_bay")
        df_hang_ve = load_df("hang_ve")
        df_hang_ban_ve = load_df("hang_ban_ve")
        df_loai_chuyen_di = load_df("loai_chuyen_di")
        df_hang_bay = load_df("hang_bay")
        df_san_bay = load_df("san_bay")

        # Register temp views
        df_gia_ve.createOrReplaceTempView("gia_ve")
        df_chuyen_bay.createOrReplaceTempView("chuyen_bay")
        df_tuyen_bay.createOrReplaceTempView("tuyen_bay")
        df_hang_ve.createOrReplaceTempView("hang_ve")
        df_hang_ban_ve.createOrReplaceTempView("hang_ban_ve")
        df_loai_chuyen_di.createOrReplaceTempView("loai_chuyen_di")
        df_hang_bay.createOrReplaceTempView("hang_bay")
        df_san_bay.createOrReplaceTempView("san_bay")

        spark = df_gia_ve.sparkSession

        query = f"""
        SELECT 
            gv.*,
            CAST(cb.gio_di AS STRING) AS gio_di,
            CAST(cb.gio_den AS STRING) AS gio_den,
            cb.ma_tuyen_bay,
            cb.ma_hang_bay,
            tb.ma_san_bay_di,
            tb.ma_san_bay_den,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den,
            hv.vi_tri_ngoi,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hbv.vai_tro,
            lcd.ten_chuyen_di,
            lcd.mo_ta,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN loai_chuyen_di lcd ON gv.ma_chuyen_di = lcd.ma_chuyen_di
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE tb.ma_san_bay_di = '{safe_from}'
        AND tb.ma_san_bay_den = '{safe_to}'
        AND lcd.ten_chuyen_di = '{safe_loai}'
        AND hv.vi_tri_ngoi = '{safe_vi_tri}'
        AND NOT gv.ma_gia_ve RLIKE '\\\\+'
        """

        result_df = spark.sql(query)
        data = result_df.toPandas().to_dict(orient="records")
        return JSONResponse(content=data)

    except Exception as e:
        print("🔥 ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chi-tiet-gia-ve", tags=["gia_ve"])
def chi_tiet_gia_ve(ma_gia_ve: str):
    try:
        df_gia_ve = load_df("gia_ve")
        df_chuyen_bay = load_df("chuyen_bay")
        df_tuyen_bay = load_df("tuyen_bay")
        df_hang_ve = load_df("hang_ve")
        df_hang_ban_ve = load_df("hang_ban_ve")
        df_loai_chuyen_di = load_df("loai_chuyen_di")
        df_hang_bay = load_df("hang_bay")
        df_san_bay = load_df("san_bay")

        df_gia_ve.createOrReplaceTempView("gia_ve")
        df_chuyen_bay.createOrReplaceTempView("chuyen_bay")
        df_tuyen_bay.createOrReplaceTempView("tuyen_bay")
        df_hang_ve.createOrReplaceTempView("hang_ve")
        df_hang_ban_ve.createOrReplaceTempView("hang_ban_ve")
        df_loai_chuyen_di.createOrReplaceTempView("loai_chuyen_di")
        df_hang_bay.createOrReplaceTempView("hang_bay")
        df_san_bay.createOrReplaceTempView("san_bay")

        spark = df_gia_ve.sparkSession

        query = f"""
        SELECT 
            gv.*,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hv.vi_tri_ngoi,
            lcd.ten_chuyen_di,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN loai_chuyen_di lcd ON gv.ma_chuyen_di = lcd.ma_chuyen_di
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        WHERE gv.ma_gia_ve = '{ma_gia_ve}'
            OR gv.ma_gia_ve LIKE '{ma_gia_ve}+%'
        ORDER BY gv.gia ASC
        """

        result_df = spark.sql(query)
        data = result_df.toPandas().to_dict(orient="records")
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
