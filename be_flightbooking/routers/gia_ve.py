from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.gia_ve import GiaVe
from utils.spark import load_df, invalidate_cache, get_spark
from utils.spark_views import get_view
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import traceback
import re

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
gia_ve_collection = db["gia_ve"]

# Helper functions
def check_exists_optimized(collection_name: str, field_name: str, value: str) -> bool:
    """Optimized existence check using cached views"""
    try:
        df = get_view(collection_name)
        if df is None:
            df = load_df(collection_name)
        return df.filter(df[field_name] == value).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_exists_optimized {collection_name}.{field_name}: {e}")
        return False

def safe_escape_sql(value: str) -> str:
    """Safely escape SQL values to prevent injection"""
    return value.replace("'", "''").replace("\\", "\\\\\\\\")

def validate_required_views():
    """Ensure all required views exist for complex queries"""
    required_collections = ["gia_ve", "chuyen_bay", "tuyen_bay", "hang_ve", "hang_ban_ve", "hang_bay", "san_bay"]
    views = {}
    
    for collection in required_collections:
        view = get_view(collection)
        if view is None:
            view = load_df(collection)
        views[collection] = view
        view.createOrReplaceTempView(collection)
    
    return views

# Request models
class GiaVeRequest(BaseModel):
    ma_gia_ves: List[str]

class SearchVeRequest(BaseModel):
    from_airport: str
    to_airport: str
    vi_tri_ngoi: str
    departure_date: Optional[str] = None
    max_price: Optional[float] = None

@router.post("", tags=["gia_ve"])
def add_gia_ve(gia_ve: GiaVe):
    """Add new ticket price with optimized validation"""
    try:
        print(f"📥 Dữ liệu nhận từ client: {gia_ve.dict()}")

        # Input validation
        if not gia_ve.ma_gia_ve or not gia_ve.ma_gia_ve.strip():
            raise HTTPException(status_code=400, detail="Mã giá vé không được để trống")

        if gia_ve.gia <= 0:
            raise HTTPException(status_code=400, detail="Giá vé phải lớn hơn 0")

        # Batch validation để tối ưu performance
        validations = [
            (check_exists_optimized("hang_ve", "ma_hang_ve", gia_ve.ma_hang_ve), "Mã hạng vé không tồn tại"),
            (check_exists_optimized("chuyen_bay", "ma_chuyen_bay", gia_ve.ma_chuyen_bay), "Mã chuyến bay không tồn tại"),
            (check_exists_optimized("hang_ban_ve", "ma_hang_ban_ve", gia_ve.ma_hang_ban_ve), "Mã hạng bán vé không tồn tại"),
            (not check_exists_optimized("gia_ve", "ma_gia_ve", gia_ve.ma_gia_ve), "Mã giá vé đã tồn tại")
        ]

        for is_valid, error_msg in validations:
            if not is_valid:
                raise HTTPException(status_code=400, detail=error_msg)

        # Insert với duplicate key handling
        try:
            data_to_insert = gia_ve.dict()
            result = gia_ve_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm giá vé")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã giá vé đã tồn tại")

        # Invalidate cache
        invalidate_cache("gia_ve")

        data_to_insert["_id"] = str(result.inserted_id)
        print(f"✅ Thêm giá vé thành công: {gia_ve.ma_gia_ve}")
        
        return JSONResponse(
            content={
                "message": "Thêm giá vé thành công", 
                "gia_ve": data_to_insert
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_gia_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["gia_ve"])
def get_all_gia_ve():
    """Get all ticket prices with detailed information"""
    try:
        spark = get_spark()
        validate_required_views()

        # Optimized query với better field selection
        query = """
        SELECT 
            gv.ma_gia_ve,
            gv.gia,
            gv.ma_chuyen_bay,
            gv.ma_hang_ve,
            gv.ma_hang_ban_ve,
            CAST(cb.gio_di AS STRING) AS gio_di,
            CAST(cb.gio_den AS STRING) AS gio_den,
            cb.ma_tuyen_bay,
            cb.ma_hang_bay,
            cb.trang_thai as trang_thai_chuyen_bay,
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
            hb.ten_hang_bay,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS flight_display
        FROM gia_ve gv
        LEFT JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        LEFT JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE gv.ma_gia_ve IS NOT NULL 
          AND gv.ma_gia_ve NOT RLIKE '\\\\+'
        ORDER BY gv.gia ASC, cb.gio_di ASC
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        print(f"✅ Lấy danh sách giá vé thành công: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_gia_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/search-ve", tags=["gia_ve"])
def search_ve(
    from_airport: str, 
    to_airport: str, 
    vi_tri_ngoi: str,
    departure_date: Optional[str] = None,
    max_price: Optional[float] = None
):
    """Search tickets with enhanced filters"""
    try:
        # Input validation và sanitization
        if not from_airport or not to_airport or not vi_tri_ngoi:
            raise HTTPException(status_code=400, detail="Thiếu thông tin tìm kiếm")

        safe_from = safe_escape_sql(from_airport.strip())
        safe_to = safe_escape_sql(to_airport.strip())
        safe_vi_tri = safe_escape_sql(vi_tri_ngoi.strip())

        spark = get_spark()
        validate_required_views()

        # Build dynamic WHERE clause
        where_conditions = [
            f"tb.ma_san_bay_di = '{safe_from}'",
            f"tb.ma_san_bay_den = '{safe_to}'",
            f"hv.vi_tri_ngoi = '{safe_vi_tri}'",
            "gv.ma_gia_ve IS NOT NULL",
            "gv.ma_gia_ve NOT RLIKE '\\\\+'"
        ]

        if departure_date:
            safe_date = safe_escape_sql(departure_date)
            where_conditions.append(f"DATE(cb.gio_di) = '{safe_date}'")

        if max_price and max_price > 0:
            where_conditions.append(f"gv.gia <= {max_price}")

        where_clause = " AND ".join(where_conditions)

        query = f"""
        SELECT 
            gv.ma_gia_ve,
            gv.gia,
            gv.ma_chuyen_bay,
            gv.ma_hang_ve,
            gv.ma_hang_ban_ve,
            CAST(cb.gio_di AS STRING) AS gio_di,
            CAST(cb.gio_den AS STRING) AS gio_den,
            cb.ma_tuyen_bay,
            cb.ma_hang_bay,
            cb.trang_thai as trang_thai_chuyen_bay,
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
            hb.ten_hang_bay,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS flight_display
        FROM gia_ve gv
        LEFT JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        LEFT JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE {where_clause}
        ORDER BY gv.gia ASC, cb.gio_di ASC
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        print(f"🔍 Tìm kiếm vé {safe_from} → {safe_to}, {safe_vi_tri}: {len(result)} kết quả")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong search_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.post("/chi-tiet-gia-ve-nhieu", tags=["gia_ve"])
def chi_tiet_gia_ve_nhieu(body: GiaVeRequest):
    """Get details for multiple ticket prices with optimized batch processing"""
    try:
        # Input validation
        if not body or not isinstance(body.ma_gia_ves, list) or len(body.ma_gia_ves) == 0:
            raise HTTPException(status_code=400, detail="Danh sách mã giá vé không hợp lệ")

        if len(body.ma_gia_ves) > 100:  # Limit batch size
            raise HTTPException(status_code=400, detail="Chỉ cho phép tối đa 100 mã giá vé mỗi lần")

        ma_gia_ves = [ma.strip() for ma in body.ma_gia_ves if ma.strip()]
        print(f"📥 Nhận ma_gia_ves ({len(ma_gia_ves)}): {ma_gia_ves}")

        spark = get_spark()
        validate_required_views()

        # Safe SQL IN clause construction
        escaped_codes = [f"'{safe_escape_sql(ma)}'" for ma in ma_gia_ves]
        in_clause = ",".join(escaped_codes)

        # Safe RLIKE clause construction
        escaped_for_regex = [re.escape(ma) for ma in ma_gia_ves]
        rlike_clause = "|".join(escaped_for_regex)

        query = f"""
        SELECT 
            gv.ma_gia_ve,
            gv.gia,
            gv.ma_chuyen_bay,
            gv.ma_hang_ve,
            gv.ma_hang_ban_ve,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.refundable,
            hv.changeable,
            hv.vi_tri_ngoi,
            hbv.ten_hang_ban_ve,
            hb.ten_hang_bay,
            cb.ma_hang_bay,
            cb.trang_thai as trang_thai_chuyen_bay,
            CAST(cb.gio_di AS STRING) AS gio_di,
            CAST(cb.gio_den AS STRING) AS gio_den
        FROM gia_ve gv
        LEFT JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        WHERE gv.ma_gia_ve IN ({in_clause})
           OR gv.ma_gia_ve RLIKE '^({rlike_clause})\\\\+'
        ORDER BY gv.gia ASC
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        print(f"✅ Lấy chi tiết {len(result)} giá vé thành công")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong chi_tiet_gia_ve_nhieu: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_gia_ve}", tags=["gia_ve"])
def get_gia_ve_day_du(ma_gia_ve: str):
    """Get detailed ticket price information by ID"""
    try:
        if not ma_gia_ve or not ma_gia_ve.strip():
            raise HTTPException(status_code=400, detail="Mã giá vé không hợp lệ")

        safe_ma_gia_ve = safe_escape_sql(ma_gia_ve.strip())
        
        spark = get_spark()
        validate_required_views()

        query = f"""
        SELECT 
            gv.*,
            CAST(cb.gio_di AS STRING) AS gio_di,
            CAST(cb.gio_den AS STRING) AS gio_den,
            cb.ma_tuyen_bay,
            cb.ma_hang_bay,
            cb.trang_thai as trang_thai_chuyen_bay,
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
            hb.ten_hang_bay,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS flight_display
        FROM gia_ve gv
        LEFT JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN tuyen_bay tb ON cb.ma_tuyen_bay = tb.ma_tuyen_bay
        LEFT JOIN hang_ve hv ON gv.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hang_ban_ve hbv ON gv.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN hang_bay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN san_bay sb_di ON tb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN san_bay sb_den ON tb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE gv.ma_gia_ve = '{safe_ma_gia_ve}'
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        if not result:
            raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

        print(f"✅ Lấy chi tiết giá vé thành công: {ma_gia_ve}")
        return JSONResponse(content=result[0])

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_gia_ve_day_du: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.put("/{ma_gia_ve}", tags=["gia_ve"])
def update_gia_ve(ma_gia_ve: str, gia_ve: GiaVe):
    """Update ticket price with validation"""
    try:
        print(f"🔄 Cập nhật giá vé: {ma_gia_ve}")

        # Check if ticket price exists
        if not check_exists_optimized("gia_ve", "ma_gia_ve", ma_gia_ve):
            raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

        # Input validation
        if gia_ve.gia <= 0:
            raise HTTPException(status_code=400, detail="Giá vé phải lớn hơn 0")

        # Update document
        update_data = gia_ve.dict()
        update_data["ma_gia_ve"] = ma_gia_ve  # Ensure consistency

        result = gia_ve_collection.update_one(
            {"ma_gia_ve": ma_gia_ve},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

        # Invalidate cache
        invalidate_cache("gia_ve")

        print(f"✅ Cập nhật giá vé thành công: {ma_gia_ve}")
        return JSONResponse(content={"message": "Cập nhật giá vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong update_gia_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_gia_ve}", tags=["gia_ve"])
def delete_gia_ve(ma_gia_ve: str):
    """Delete ticket price with validation"""
    try:
        print(f"🗑 Nhận yêu cầu xóa giá vé: {ma_gia_ve}")

        # Check if ticket price exists
        if not check_exists_optimized("gia_ve", "ma_gia_ve", ma_gia_ve):
            raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

        # Delete document
        result = gia_ve_collection.delete_one({"ma_gia_ve": ma_gia_ve})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

        # Invalidate cache
        invalidate_cache("gia_ve")

        print(f"✅ Xóa giá vé thành công: {ma_gia_ve}")
        return JSONResponse(content={"message": f"Xóa giá vé {ma_gia_ve} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong delete_gia_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/stats/summary", tags=["gia_ve"])
def get_gia_ve_stats():
    """Get ticket price statistics"""
    try:
        spark = get_spark()
        validate_required_views()

        query = """
        SELECT 
            COUNT(*) as total_prices,
            MIN(gv.gia) as min_price,
            MAX(gv.gia) as max_price,
            AVG(gv.gia) as avg_price,
            COUNT(DISTINCT gv.ma_chuyen_bay) as unique_flights,
            COUNT(DISTINCT gv.ma_hang_ve) as unique_classes,
            COUNT(DISTINCT cb.ma_hang_bay) as unique_airlines
        FROM gia_ve gv
        LEFT JOIN chuyen_bay cb ON gv.ma_chuyen_bay = cb.ma_chuyen_bay
        WHERE gv.ma_gia_ve IS NOT NULL
        """

        df_stats = spark.sql(query)
        stats = df_stats.collect()[0].asDict()

        return JSONResponse(content=stats)

    except Exception as e:
        print(f"❌ Lỗi lấy thống kê: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi lấy thống kê giá vé")
