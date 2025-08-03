from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.gia_ve import GiaVe
from utils.spark import load_df, invalidate_cache
from pydantic import BaseModel
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pyspark import StorageLevel
from utils.spark_views import cached_views
import pandas as pd
import traceback
import re

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
        spark = cached_views["gia_ve"].sparkSession

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
            sb_di.thanh_pho AS ten_thanh_pho_di,
            sb_den.thanh_pho AS ten_thanh_pho_den,
            hv.vi_tri_ngoi,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE NOT gv.ma_gia_ve RLIKE '\\\\+'
        """

        result = spark.sql(query).toPandas().to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi khi đọc dữ liệu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/search-ve", tags=["gia_ve"])
def search_ve(
    from_airport: str, to_airport: str, vi_tri_ngoi: str
):
    try:
        safe_from = from_airport.replace("'", "''")
        safe_to = to_airport.replace("'", "''")
        safe_vi_tri = re.escape(vi_tri_ngoi)

        spark = cached_views["gia_ve"].sparkSession

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
            sb_di.thanh_pho AS ten_thanh_pho_di,
            sb_den.thanh_pho AS ten_thanh_pho_den,
            hv.vi_tri_ngoi,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE tb.ma_san_bay_di = '{safe_from}'
          AND tb.ma_san_bay_den = '{safe_to}'
          AND hv.vi_tri_ngoi = '{safe_vi_tri}'
          AND NOT gv.ma_gia_ve RLIKE '\\\\+'
        """

        df = spark.sql(query)
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        import traceback

        print("🔥 ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


class GiaVeRequest(BaseModel):
    ma_gia_ves: list[str]

@router.post("/chi-tiet-gia-ve-nhieu", tags=["gia_ve"])
def chi_tiet_gia_ve_nhieu(body: GiaVeRequest):
    try:
        # ✅ Validate input rõ ràng
        if not body or not isinstance(body.ma_gia_ves, list) or len(body.ma_gia_ves) == 0:
            raise HTTPException(status_code=400, detail="Danh sách mã giá vé không hợp lệ")

        ma_gia_ves = body.ma_gia_ves
        print(f"📥 Nhận ma_gia_ves ({len(ma_gia_ves)}): {ma_gia_ves}")

        spark = cached_views["gia_ve"].sparkSession

        # ✅ Chuẩn bị IN và RLIKE clause an toàn
        in_clause = ",".join([f"'{re.escape(ma)}'" for ma in ma_gia_ves])
        rlike_clause = "|".join([re.escape(ma) for ma in ma_gia_ves])

        query = f"""
        SELECT 
            gv.*,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hv.vi_tri_ngoi,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        WHERE gv.ma_gia_ve IN ({in_clause})
           OR gv.ma_gia_ve RLIKE '^{rlike_clause}\\\+'
        ORDER BY gv.gia ASC
        """

        # ✅ Persist kết quả (cache nội bộ) để tránh Spark tính lại
        df = spark.sql(query).persist(StorageLevel.MEMORY_AND_DISK)
        df.count()  # Trigger thực thi (lazy eval)
        data = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=data)

    except HTTPException as he:
        raise he
    except Exception as e:
        print("🔥 Lỗi batch chi_tiet_gia_ve_nhieu:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_gia_ve}", tags=["gia_ve"])
def get_gia_ve_day_du(ma_gia_ve: str):
    try:
        spark = cached_views["gia_ve"].sparkSession

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
            sb_di.thanh_pho AS ten_thanh_pho_di,
            sb_den.thanh_pho AS ten_thanh_pho_den,
            hv.vi_tri_ngoi,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hb.ten_hang_bay
        FROM gia_ve gv
        JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE gv.ma_gia_ve = '{ma_gia_ve}'
        """

        df = spark.sql(query)
        result = df.toPandas().to_dict(orient="records")

        if not result:
            raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

        return JSONResponse(content=result[0])
    except Exception as e:
        import traceback
        print("🔥 Lỗi khi truy vấn chi tiết giá vé:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
