from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pyspark import StorageLevel
from models.ve import Ve
from utils.spark import load_df, get_spark, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel
from typing import List, Optional
import traceback
import pandas as pd
import io

router = APIRouter()
client = MongoClient(MONGO_URI)
ve_collection = client[MONGO_DB]["ve"]


def safe_escape_sql(value: str) -> str:
    return value.replace("'", "''").replace("\\", "\\\\")


def check_exists_optimized(collection_name: str, field_name: str, value: str) -> bool:
    try:
        df = load_df(collection_name)
        return df.filter(df[field_name] == value).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_exists_optimized {collection_name}.{field_name}: {e}")
        return False


# Request models
class GiaVeRequest(BaseModel):
    ma_gia_ves: List[str]


@router.post("", tags=["ve"])
def add_ve(ve: Ve):
    try:
        if not ve.ma_ve.strip():
            raise HTTPException(status_code=400, detail="Mã vé không được để trống")
        if ve.gia_ve <= 0:
            raise HTTPException(status_code=400, detail="Giá vé phải lớn hơn 0")
        if not ve.ma_hang_ve or not ve.ma_hang_ve.strip():
            raise HTTPException(
                status_code=400, detail="Mã hạng vé không được để trống"
            )
        if not ve.ma_chuyen_bay or not ve.ma_chuyen_bay.strip():
            raise HTTPException(
                status_code=400, detail="Mã chuyến bay không được để trống"
            )
        if not ve.ma_hang_ban_ve or not ve.ma_hang_ban_ve.strip():
            raise HTTPException(
                status_code=400, detail="Mã hãng bán vé không được để trống"
            )

        if check_exists_optimized("ve", "ma_ve", ve.ma_ve):
            raise HTTPException(status_code=400, detail="Mã vé đã tồn tại")

        validations = [
            (
                check_exists_optimized("hangve", "ma_hang_ve", ve.ma_hang_ve),
                "Mã hạng vé không tồn tại",
            ),
            (
                check_exists_optimized("chuyenbay", "ma_chuyen_bay", ve.ma_chuyen_bay),
                "Mã chuyến bay không tồn tại",
            ),
            (
                check_exists_optimized(
                    "hangbanve", "ma_hang_ban_ve", ve.ma_hang_ban_ve
                ),
                "Mã hãng bán vé không tồn tại",
            ),
        ]

        for is_valid, error_msg in validations:
            if not is_valid:
                raise HTTPException(status_code=400, detail=error_msg)

        data_to_insert = ve.dict()
        try:
            result = ve_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm vé")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã vé đã tồn tại")

        # Refresh cache để có dữ liệu mới ngay lập tức
        invalidate_cache("ve")
        data_to_insert["_id"] = str(result.inserted_id)

        return JSONResponse(
            content={"message": "Thêm vé thành công", "ve": data_to_insert},
            status_code=201,
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["ve"])
def get_all_ve():
    try:
        spark = get_spark()
        spark.conf.set("spark.sql.execution.arrow.pyspark.fallback.enabled", "true")

        query = """
        SELECT /*+ BROADCAST(hv), BROADCAST(hbv), BROADCAST(hb), BROADCAST(sb_di), BROADCAST(sb_den) */
            v.ma_ve,
            v.gia_ve,
            v.ma_chuyen_bay,
            v.ma_hang_ve,
            v.ma_hang_ban_ve,
            CAST(cb.thoi_gian_di AS STRING) AS thoi_gian_di,
            CAST(cb.thoi_gian_den AS STRING) AS thoi_gian_den,
            cb.ma_hang_bay,
            cb.ma_san_bay_di,
            cb.ma_san_bay_den,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den,
            sb_di.thanh_pho AS ten_thanh_pho_di,
            sb_den.thanh_pho AS ten_thanh_pho_den,
            hv.ten_hang_ve,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hbv.vai_tro,
            hb.ten_hang_bay,
            hb.iata_code as hang_bay_iata,
            hb.quoc_gia,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS flight_display
        FROM ve v
        LEFT JOIN chuyenbay cb ON v.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN hangve hv ON v.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hangbanve hbv ON v.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN hangbay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN sanbay sb_di ON cb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN sanbay sb_den ON cb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE v.ma_ve IS NOT NULL
        ORDER BY v.gia_ve ASC, cb.thoi_gian_di ASC
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        print(f"✅ Lấy danh sách vé thành công từ cache: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/search-ve", tags=["ve"])
def search_ve(
    from_airport: str,
    to_airport: str,
    ten_hang_ve: str,
    departure_date: Optional[str] = None,
    max_price: Optional[float] = None,
):
    try:
        if not from_airport or not to_airport or not ten_hang_ve:
            raise HTTPException(status_code=400, detail="Thiếu thông tin tìm kiếm")

        spark = get_spark()
        spark.conf.set("spark.sql.execution.arrow.pyspark.fallback.enabled", "true")
        spark.conf.set(
            "spark.sql.autoBroadcastJoinThreshold", "-1"
        )  # tắt auto broadcast

        # Các bảng nhỏ cần broadcast
        broadcast_tables = ["hangve", "hangbanve", "hangbay", "sanbay"]
        for tbl in broadcast_tables:
            df = load_df(tbl).persist(StorageLevel.MEMORY_AND_DISK).hint("broadcast")
            df.createOrReplaceTempView(tbl)

        # Các bảng lớn không broadcast
        for tbl in ["ve", "chuyenbay"]:
            load_df(tbl).persist(StorageLevel.MEMORY_AND_DISK).createOrReplaceTempView(
                tbl
            )

        conditions = [
            f"cb.ma_san_bay_di = '{safe_escape_sql(from_airport.strip())}'",
            f"cb.ma_san_bay_den = '{safe_escape_sql(to_airport.strip())}'",
            f"hv.ten_hang_ve = '{safe_escape_sql(ten_hang_ve.strip())}'",
            "v.ma_ve IS NOT NULL",
        ]

        if departure_date:
            conditions.append(
                f"DATE(cb.thoi_gian_di) = '{safe_escape_sql(departure_date)}'"
            )

        if max_price and max_price > 0:
            conditions.append(f"v.gia_ve <= {max_price}")

        where_clause = " AND ".join(conditions)

        query = f"""
        SELECT /*+ BROADCAST(hv), BROADCAST(hbv), BROADCAST(hb), BROADCAST(sb_di), BROADCAST(sb_den) */
            v.ma_ve,
            v.gia_ve,
            v.ma_chuyen_bay,
            v.ma_hang_ve,
            v.ma_hang_ban_ve,
            CAST(cb.thoi_gian_di AS STRING) AS thoi_gian_di,
            CAST(cb.thoi_gian_den AS STRING) AS thoi_gian_den,
            cb.ma_hang_bay,
            cb.ma_san_bay_di,
            cb.ma_san_bay_den,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den,
            sb_di.thanh_pho AS ten_thanh_pho_di,
            sb_den.thanh_pho AS ten_thanh_pho_den,
            hv.ten_hang_ve,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hbv.vai_tro,
            hb.ten_hang_bay,
            hb.iata_code as hang_bay_iata,
            hb.quoc_gia,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS flight_display
        FROM ve v
        LEFT JOIN chuyenbay cb ON v.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN hangve hv ON v.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hangbanve hbv ON v.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN hangbay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN sanbay sb_di ON cb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN sanbay sb_den ON cb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE {where_clause}
        ORDER BY v.gia_ve ASC, cb.thoi_gian_di ASC
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")
        print(
            f"🔍 Tìm kiếm vé {from_airport} → {to_airport}, {ten_hang_ve}: {len(result)} kết quả"
        )
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong search_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("/chi-tiet-ve-nhieu", tags=["ve"])
def chi_tiet_ve_nhieu(body: GiaVeRequest):
    try:
        if (
            not body
            or not isinstance(body.ma_gia_ves, list)
            or len(body.ma_gia_ves) == 0
        ):
            raise HTTPException(status_code=400, detail="Danh sách mã vé không hợp lệ")
        if len(body.ma_gia_ves) > 100:
            raise HTTPException(
                status_code=400, detail="Chỉ cho phép tối đa 100 mã vé mỗi lần"
            )

        ma_ves = [ma.strip() for ma in body.ma_gia_ves if ma.strip()]
        print(f"📥 Nhận ma_ves ({len(ma_ves)}): {ma_ves}")

        spark = get_spark()
        spark.conf.set("spark.sql.execution.arrow.pyspark.fallback.enabled", "true")
        spark.conf.set(
            "spark.sql.autoBroadcastJoinThreshold", "-1"
        )  # Tắt auto broadcast

        # Broadcast các bảng nhỏ
        for tbl in ["hangve", "hangbanve", "hangbay"]:
            df = load_df(tbl).persist(StorageLevel.MEMORY_AND_DISK).hint("broadcast")
            df.createOrReplaceTempView(tbl)

        # Bảng lớn không broadcast
        for tbl in ["ve", "chuyenbay"]:
            load_df(tbl).persist(StorageLevel.MEMORY_AND_DISK).createOrReplaceTempView(
                tbl
            )

        # Xây WHERE IN an toàn
        escaped_codes = [f"'{safe_escape_sql(ma)}'" for ma in ma_ves]
        in_clause = ",".join(escaped_codes)

        query = f"""
        SELECT 
            v.ma_ve,
            v.gia_ve,
            v.ma_chuyen_bay,
            v.ma_hang_ve,
            v.ma_hang_ban_ve,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.refundable,
            hv.changeable,
            hv.ten_hang_ve,
            hbv.ten_hang_ban_ve,
            hb.ten_hang_bay,
            cb.ma_hang_bay,
            CAST(cb.thoi_gian_di AS STRING) AS thoi_gian_di,
            CAST(cb.thoi_gian_den AS STRING) AS thoi_gian_den
        FROM ve v
        LEFT JOIN hangve hv ON v.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hangbanve hbv ON v.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN chuyenbay cb ON v.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN hangbay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        WHERE v.ma_ve IN ({in_clause})
        ORDER BY v.gia_ve ASC
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        print(f"✅ Lấy chi tiết {len(result)} vé thành công từ cache")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong chi_tiet_ve_nhieu: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/{ma_gia_ve}", tags=["gia_ve"])
def get_gia_ve_day_du(ma_gia_ve: str):
    """Get detailed ticket price information by ID - supports pattern matching with optimized Spark broadcast"""
    try:
        if not ma_gia_ve or not ma_gia_ve.strip():
            raise HTTPException(status_code=400, detail="Mã giá vé không hợp lệ")

        safe_ma_gia_ve = safe_escape_sql(ma_gia_ve.strip())

        spark = get_spark()
        spark.conf.set("spark.sql.execution.arrow.pyspark.fallback.enabled", "true")
        spark.conf.set(
            "spark.sql.autoBroadcastJoinThreshold", "-1"
        )  # Tắt tự động broadcast

        # ✅ Broadcast các bảng nhỏ
        for tbl in ["hangve", "hangbanve", "hangbay", "sanbay"]:
            df = load_df(tbl).hint("broadcast")
            df.createOrReplaceTempView(tbl)

        # ✅ Persist bảng lớn hơn
        for tbl in ["ve", "chuyenbay"]:
            load_df(tbl).persist().createOrReplaceTempView(tbl)

        query = f"""
        SELECT 
            v.ma_ve,
            v.gia_ve,
            v.ma_chuyen_bay,
            v.ma_hang_ve,
            v.ma_hang_ban_ve,
            CAST(cb.thoi_gian_di AS STRING) AS thoi_gian_di,
            CAST(cb.thoi_gian_den AS STRING) AS thoi_gian_den,
            cb.ma_hang_bay,
            cb.ma_san_bay_di,
            cb.ma_san_bay_den,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den,
            sb_di.thanh_pho AS ten_thanh_pho_di,
            sb_den.thanh_pho AS ten_thanh_pho_den,
            sb_di.ma_san_bay AS ma_san_bay_di_full,
            sb_den.ma_san_bay AS ma_san_bay_den_full,
            sb_di.iata_code AS iata_code_di,
            sb_den.iata_code AS iata_code_den,
            sb_di.ma_quoc_gia AS ma_quoc_gia_di,
            sb_den.ma_quoc_gia AS ma_quoc_gia_den,
            hv.ten_hang_ve,
            hv.so_kg_hanh_ly_ky_gui,
            hv.so_kg_hanh_ly_xach_tay,
            hv.so_do_ghe,
            hv.khoang_cach_ghe,
            hv.refundable,
            hv.changeable,
            hbv.ten_hang_ban_ve,
            hbv.vai_tro,
            hb.ten_hang_bay,
            hb.iata_code AS hang_bay_iata,
            hb.quoc_gia,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS flight_display,
            CONCAT(hv.ten_hang_ve) AS package_display
        FROM ve v
        LEFT JOIN chuyenbay cb ON v.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN hangve hv ON v.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN hangbanve hbv ON v.ma_hang_ban_ve = hbv.ma_hang_ban_ve
        LEFT JOIN hangbay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN sanbay sb_di ON cb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN sanbay sb_den ON cb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE (v.ma_ve = '{safe_ma_gia_ve}' OR v.ma_ve LIKE '{safe_ma_gia_ve}+%')
        ORDER BY v.ma_ve ASC
        """

        print(f"🔍 Executing query for ma_ve pattern: {safe_ma_gia_ve}")
        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")

        if not result:
            print(f"❌ Không tìm thấy vé với mã: {safe_ma_gia_ve}")
            raise HTTPException(status_code=404, detail="Không tìm thấy thông tin vé")

        print(
            f"✅ Lấy chi tiết vé thành công: {safe_ma_gia_ve} - Found {len(result)} records"
        )

        return JSONResponse(content=result[0] if len(result) == 1 else result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_gia_ve_day_du: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# @router.put("/{ma_gia_ve}", tags=["gia_ve"])
# def update_gia_ve(ma_gia_ve: str, gia_ve: Ve):
#     """Update ticket price with validation"""
#     try:
#         print(f"🔄 Cập nhật giá vé: {ma_gia_ve}")

#         # Check if ticket price exists
#         if not check_exists_optimized("gia_ve", "ma_gia_ve", ma_gia_ve):
#             raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

#         # Input validation
#         if gia_ve.gia <= 0:
#             raise HTTPException(status_code=400, detail="Giá vé phải lớn hơn 0")

#         # Update document
#         update_data = gia_ve.dict()
#         update_data["ma_gia_ve"] = ma_gia_ve

#         result = gia_ve_collection.update_one(
#             {"ma_gia_ve": ma_gia_ve}, {"$set": update_data}
#         )

#         if result.matched_count == 0:
#             raise HTTPException(status_code=404, detail="Không tìm thấy giá vé")

#         # Invalidate cache
#         invalidate_cache("gia_ve")

#         print(f"✅ Cập nhật giá vé thành công: {ma_gia_ve}")
#         return JSONResponse(content={"message": "Cập nhật giá vé thành công"})

#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Lỗi trong update_gia_ve: {repr(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


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
    """Get ticket price statistics using Spark SQL"""
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


@router.post("/import-excel", tags=["ve"])
async def import_ve_from_excel(file: UploadFile = File(...)):
    """Import tickets from Excel file - SIMPLIFIED"""
    try:
        # 🔥 Validate file type
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(
                status_code=400, detail="Chỉ chấp nhận file Excel (.xlsx, .xls)"
            )

        print(f"📥 Import Excel file: {file.filename}")

        # 🔥 Read Excel
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        print(f"📊 Excel columns: {df.columns.tolist()}")
        print(f"📊 Excel rows: {len(df)}")

        # 🔥 FLEXIBLE column mapping - accept different column names
        column_mappings = {
            "ma_ve": ["ma_ve", "Ma_ve", "MA_VE", "mave", "ticket_id", "ticket_code"],
            "gia_ve": ["gia_ve", "Gia_ve", "GIA_VE", "giave", "price", "gia"],
            "ma_hang_ve": [
                "ma_hang_ve",
                "Ma_hang_ve",
                "MA_HANG_VE",
                "mahangve",
                "class_code",
                "hang_ve",
            ],
            "ma_chuyen_bay": [
                "ma_chuyen_bay",
                "Ma_chuyen_bay",
                "MA_CHUYEN_BAY",
                "machuyenbay",
                "flight_code",
                "chuyen_bay",
            ],
            "ma_hang_ban_ve": [
                "ma_hang_ban_ve",
                "Ma_hang_ban_ve",
                "MA_HANG_BAN_VE",
                "mahangbanve",
                "seller_code",
                "hang_ban_ve",
            ],
        }

        # 🔥 Auto-detect columns
        detected_columns = {}
        for standard_name, possible_names in column_mappings.items():
            found = False
            for possible in possible_names:
                if possible in df.columns:
                    detected_columns[standard_name] = possible
                    found = True
                    break
            if not found:
                print(f"⚠️ Column '{standard_name}' not found, will use default")

        print(f"🔍 Detected columns: {detected_columns}")

        # 🔥 Rename columns to standard names
        df_renamed = df.copy()
        for standard, detected in detected_columns.items():
            if detected in df_renamed.columns:
                df_renamed = df_renamed.rename(columns={detected: standard})

        # 🔥 Keep only required columns that exist
        required_columns = [
            "ma_ve",
            "gia_ve",
            "ma_hang_ve",
            "ma_chuyen_bay",
            "ma_hang_ban_ve",
        ]
        available_columns = [
            col for col in required_columns if col in df_renamed.columns
        ]

        if not available_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Không tìm thấy cột nào trong số: {required_columns}. Available: {df.columns.tolist()}",
            )

        df_clean = df_renamed[available_columns].copy()

        # 🔥 Drop rows with missing critical data
        df_clean = df_clean.dropna(
            subset=["ma_ve"] if "ma_ve" in df_clean.columns else available_columns[:1]
        )

        if df_clean.empty:
            raise HTTPException(status_code=400, detail="File không có dữ liệu hợp lệ")

        print(f"📋 Clean data shape: {df_clean.shape}")
        print(f"📋 Sample data:\n{df_clean.head()}")

        # 🔥 Process each row - MINIMAL validation
        success_count = 0
        error_count = 0
        errors = []

        # Get existing ma_ve to avoid duplicates
        existing_ma_ves = set()
        try:
            existing_docs = ve_collection.find({}, {"ma_ve": 1})
            existing_ma_ves = {doc["ma_ve"] for doc in existing_docs if "ma_ve" in doc}
            print(f"📝 Found {len(existing_ma_ves)} existing tickets")
        except Exception as e:
            print(f"⚠️ Could not load existing tickets: {e}")

        for index, row in df_clean.iterrows():
            try:
                # 🔥 Build data dict from available columns
                ve_data = {}

                for col in available_columns:
                    value = row[col]
                    if pd.isna(value):
                        if col == "ma_ve":
                            errors.append(
                                f"Dòng {index + 2}: Mã vé không được để trống"
                            )
                            error_count += 1
                            continue
                        ve_data[col] = ""
                    elif col == "gia_ve":
                        try:
                            ve_data[col] = float(value)
                            if ve_data[col] <= 0:
                                errors.append(
                                    f"Dòng {index + 2}: Giá vé phải lớn hơn 0"
                                )
                                error_count += 1
                                continue
                        except (ValueError, TypeError):
                            errors.append(
                                f"Dòng {index + 2}: Giá vé không hợp lệ: {value}"
                            )
                            error_count += 1
                            continue
                    else:
                        ve_data[col] = str(value).strip()

                # Skip if ma_ve validation failed
                if "ma_ve" not in ve_data:
                    continue

                # 🔥 Check duplicate
                if ve_data["ma_ve"] in existing_ma_ves:
                    errors.append(
                        f"Dòng {index + 2}: Mã vé {ve_data['ma_ve']} đã tồn tại"
                    )
                    error_count += 1
                    continue

                # 🔥 Fill missing fields with defaults
                default_values = {
                    "gia_ve": 0.0,
                    "ma_hang_ve": "DEFAULT",
                    "ma_chuyen_bay": "DEFAULT",
                    "ma_hang_ban_ve": "DEFAULT",
                }

                for field, default in default_values.items():
                    if field not in ve_data:
                        ve_data[field] = default

                # 🔥 Insert to database
                try:
                    result = ve_collection.insert_one(ve_data)
                    if result.inserted_id:
                        success_count += 1
                        existing_ma_ves.add(
                            ve_data["ma_ve"]
                        )  # Add to set to prevent duplicates in same import
                        if success_count % 10 == 0:
                            print(f"📈 Imported {success_count} records...")
                    else:
                        errors.append(f"Dòng {index + 2}: Không thể thêm vào database")
                        error_count += 1
                except DuplicateKeyError:
                    errors.append(
                        f"Dòng {index + 2}: Mã vé {ve_data['ma_ve']} đã tồn tại"
                    )
                    error_count += 1
                except Exception as insert_err:
                    errors.append(f"Dòng {index + 2}: Lỗi insert: {str(insert_err)}")
                    error_count += 1

            except Exception as row_err:
                errors.append(f"Dòng {index + 2}: {str(row_err)}")
                error_count += 1

        # 🔥 Invalidate cache if successful
        if success_count > 0:
            invalidate_cache("ve")

        # 🔥 Result summary
        result_message = {
            "message": f"Import hoàn tất: {success_count} thành công, {error_count} lỗi",
            "success_count": success_count,
            "error_count": error_count,
            "errors": errors[:20] if errors else [],  # Show first 20 errors
            "total_errors": len(errors),
            "detected_columns": detected_columns,
            "processed_rows": len(df_clean),
        }

        print(f"📊 Import kết quả: {success_count} thành công, {error_count} lỗi")

        return JSONResponse(content=result_message)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi import Excel: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý file Excel: {str(e)}")


@router.patch("/fix-hang-ban-ve", tags=["ve"])
def fix_hang_ban_ve_to_default():
    """Fix tất cả ma_hang_ban_ve về HBV001 - EMERGENCY FIX"""
    try:
        print("🔧 FIXING: Update tất cả ma_hang_ban_ve về HBV001...")

        # 🔥 UPDATE tất cả records về HBV001
        result = ve_collection.update_many(
            {}, {"$set": {"ma_hang_ban_ve": "HBV001"}}  # Empty filter = update ALL
        )

        print(f"✅ Updated {result.modified_count} records to HBV001")

        # Invalidate cache
        invalidate_cache("ve")

        return JSONResponse(
            content={
                "message": f"✅ Đã fix {result.modified_count} vé về ma_hang_ban_ve = HBV001",
                "updated_count": result.modified_count,
                "fixed_value": "HBV001",
            }
        )

    except Exception as e:
        print(f"❌ Lỗi fix hang_ban_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi fix hang_ban_ve")
