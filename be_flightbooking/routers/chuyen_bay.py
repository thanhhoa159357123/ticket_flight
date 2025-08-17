from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.chuyenbay import ChuyenBay
from utils.spark import load_df, get_spark, refresh_cache, invalidate_cache
from utils.spark_views import get_view
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from datetime import datetime, timedelta
from pydantic import BaseModel
import pandas as pd
import uuid
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
chuyen_bay_collection = db["chuyenbay"]

# Helper functions
def check_exists_optimized(collection_name: str, field_name: str, value: str) -> bool:
    """Optimized existence check using cached DataFrame"""
    try:
        df = load_df(collection_name)
        return df.filter(df[field_name] == value).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_exists_optimized {collection_name}.{field_name}: {e}")
        return False

def safe_datetime_convert(dt_value):
    """Safely convert datetime strings to datetime objects"""
    if isinstance(dt_value, str):
        # Handle multiple datetime formats
        formats = [
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%Y-%m-%dT%H:%M:%SZ", 
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M:%S"
        ]
        for fmt in formats:
            try:
                return datetime.strptime(dt_value, fmt)
            except ValueError:
                continue
        # Fallback: use fromisoformat
        return datetime.fromisoformat(dt_value.replace('Z', '+00:00'))
    return dt_value

# Models for bulk operations
class BulkUpdateRequest(BaseModel):
    days_to_add: int
    new_status: str = "Đang hoạt động"

class GenerateFutureRequest(BaseModel):
    days_ahead: int = 30
    base_date: str

@router.post("", tags=["chuyen_bay"])
def add_chuyen_bay(chuyen_bay: ChuyenBay):
    """Add new flight with proper validation"""
    try:
        print(f"🔥 Nhận yêu cầu POST /add: {chuyen_bay.ma_chuyen_bay}")
        print(f"📥 Dữ liệu: {chuyen_bay.dict()}")

        # Input validation
        if not chuyen_bay.ma_chuyen_bay or not chuyen_bay.ma_chuyen_bay.strip():
            raise HTTPException(status_code=400, detail="Mã chuyến bay không được để trống")

        # Datetime validation
        if chuyen_bay.thoi_gian_di >= chuyen_bay.thoi_gian_den:
            raise HTTPException(status_code=400, detail="Giờ đi phải trước giờ đến")

        # Check duplicate first (sử dụng cached DataFrame)
        if check_exists_optimized("chuyenbay", "ma_chuyen_bay", chuyen_bay.ma_chuyen_bay):
            raise HTTPException(status_code=400, detail="Mã chuyến bay đã tồn tại")

        # Batch validation cho foreign keys (sử dụng cached DataFrames)
        validations = [
            (check_exists_optimized("hangbay", "ma_hang_bay", chuyen_bay.ma_hang_bay), 
             "Mã hãng bay không tồn tại"),
            (check_exists_optimized("sanbay", "ma_san_bay", chuyen_bay.ma_san_bay_di), 
             "Sân bay đi không tồn tại"),
            (check_exists_optimized("sanbay", "ma_san_bay", chuyen_bay.ma_san_bay_den), 
             "Sân bay đến không tồn tại")
        ]

        for is_valid, error_msg in validations:
            if not is_valid:
                raise HTTPException(status_code=400, detail=error_msg)

        # Business logic validation
        if chuyen_bay.ma_san_bay_di == chuyen_bay.ma_san_bay_den:
            raise HTTPException(status_code=400, detail="Sân bay đi và đến không được giống nhau")

        # Prepare data for insert
        data_to_insert = chuyen_bay.dict()
        data_to_insert["created_at"] = datetime.now()
        print(f"💾 Chuẩn bị insert: {data_to_insert}")

        # Insert với duplicate key handling
        try:
            result = chuyen_bay_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm chuyến bay")
                
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã chuyến bay đã tồn tại")
        except Exception as insert_err:
            print(f"❌ Insert error: {insert_err}")
            raise HTTPException(status_code=500, detail=f"Lỗi insert: {str(insert_err)}")

        # Refresh cache để có dữ liệu mới ngay lập tức
        invalidate_cache("chuyenbay")
        print("✅ Cache refreshed")

        # Response with formatted datetime
        response_data = chuyen_bay.dict()
        response_data["_id"] = str(result.inserted_id)
        
        # Safe datetime formatting
        try:
            if hasattr(chuyen_bay.thoi_gian_di, 'strftime'):
                response_data["thoi_gian_di"] = chuyen_bay.thoi_gian_di.strftime("%d/%m/%Y, %H:%M:%S")
            if hasattr(chuyen_bay.thoi_gian_den, 'strftime'):
                response_data["thoi_gian_den"] = chuyen_bay.thoi_gian_den.strftime("%d/%m/%Y, %H:%M:%S")
        except Exception as dt_err:
            print(f"⚠️ Datetime format warning: {dt_err}")

        print(f"🎉 Thêm chuyến bay thành công: {chuyen_bay.ma_chuyen_bay}")
        return JSONResponse(
            content={
                "message": "Thêm chuyến bay thành công", 
                "chuyen_bay": response_data
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_chuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {str(e)}")

@router.get("", tags=["chuyen_bay"])
def get_all_chuyen_bay():
    """Get all flights with proper JOIN query using cached DataFrames"""
    try:
        spark = get_spark()
        
        # Load cached DataFrames với error handling
        try:
            chuyen_bay_df = load_df("chuyenbay")
            hang_bay_df = load_df("hangbay")
            san_bay_df = load_df("sanbay")
            
            print("✅ All DataFrames loaded successfully from cache")
            
        except Exception as load_err:
            print(f"❌ Error loading DataFrames: {load_err}")
            raise HTTPException(status_code=500, detail="Lỗi tải dữ liệu")

        # Create temp views for SQL
        chuyen_bay_df.createOrReplaceTempView("chuyenbay")
        hang_bay_df.createOrReplaceTempView("hangbay")
        san_bay_df.createOrReplaceTempView("sanbay")

        # Fixed SQL query với correct field names
        query = """
        SELECT 
            cb.ma_chuyen_bay, 
            cb.ma_hang_bay, 
            cb.ma_san_bay_di,
            cb.ma_san_bay_den,
            CAST(cb.thoi_gian_di AS STRING) AS thoi_gian_di,
            CAST(cb.thoi_gian_den AS STRING) AS thoi_gian_den,
            hb.ten_hang_bay,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den,
            sb_di.thanh_pho AS thanh_pho_di,
            sb_den.thanh_pho AS thanh_pho_den,
            CONCAT(hb.ten_hang_bay, ' - ', cb.ma_chuyen_bay) AS display_name,
            CONCAT(sb_di.thanh_pho, ' → ', sb_den.thanh_pho) AS route_display
        FROM chuyenbay cb
        LEFT JOIN hangbay hb ON cb.ma_hang_bay = hb.ma_hang_bay
        LEFT JOIN sanbay sb_di ON cb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN sanbay sb_den ON cb.ma_san_bay_den = sb_den.ma_san_bay
        WHERE cb.ma_chuyen_bay IS NOT NULL
        ORDER BY cb.thoi_gian_di DESC
        """

        print(f"🔍 Executing optimized query with cached data...")
        df_result = spark.sql(query)
        
        # Convert to pandas với error handling
        try:
            pdf = df_result.toPandas()
            print(f"📊 Query result: {len(pdf)} records")
            
        except Exception as pandas_err:
            print(f"❌ Pandas conversion error: {pandas_err}")
            raise HTTPException(status_code=500, detail="Lỗi chuyển đổi dữ liệu")

        # Safe datetime formatting
        if not pdf.empty and 'thoi_gian_di' in pdf.columns:
            try:
                # Handle datetime formatting safely
                pdf["thoi_gian_di_formatted"] = pd.to_datetime(pdf["thoi_gian_di"], errors='coerce').dt.strftime("%d/%m/%Y, %H:%M:%S")
                pdf["thoi_gian_den_formatted"] = pd.to_datetime(pdf["thoi_gian_den"], errors='coerce').dt.strftime("%d/%m/%Y, %H:%M:%S")
                
                # Replace original columns
                pdf["thoi_gian_di"] = pdf["thoi_gian_di_formatted"]
                pdf["thoi_gian_den"] = pdf["thoi_gian_den_formatted"]
                
                # Drop temp columns
                pdf = pdf.drop(columns=["thoi_gian_di_formatted", "thoi_gian_den_formatted"], errors='ignore')
                
            except Exception as dt_error:
                print(f"⚠️ Lỗi format datetime (keeping original): {dt_error}")

        result = pdf.to_dict(orient="records")
        print(f"✅ Lấy danh sách chuyến bay thành công từ cache: {len(result)} records")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_all_chuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {str(e)}")


@router.get("/{ma_chuyen_bay}", tags=["chuyen_bay"])
def get_chuyen_bay_by_id(ma_chuyen_bay: str):
    """Get flight by ID with detailed information"""
    try:
        spark = get_spark()
        
        # Ensure views exist
        chuyen_bay_df = get_view("chuyen_bay")
        if chuyen_bay_df is None:
            chuyen_bay_df = load_df("chuyen_bay")
        
        chuyen_bay_df.createOrReplaceTempView("chuyen_bay")

        query = f"""
        SELECT *
        FROM chuyen_bay 
        WHERE ma_chuyen_bay = '{ma_chuyen_bay}'
        """

        df_result = spark.sql(query)
        
        if df_result.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy chuyến bay")
        
        result = df_result.toPandas().to_dict(orient="records")[0]
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_chuyen_bay_by_id: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# @router.patch("/bulk-update-dates", tags=["chuyen_bay"])
# def bulk_update_flight_dates(request: BulkUpdateRequest):
#     """Bulk update flight dates with improved error handling"""
#     try:
#         current_date = datetime.now()
#         days_to_add = request.days_to_add
#         new_status = request.new_status
        
#         print(f"🔄 Bắt đầu bulk update: cộng {days_to_add} ngày, trạng thái mới: {new_status}")
        
#         # Input validation
#         if abs(days_to_add) > 3650:  # Max 10 years
#             raise HTTPException(status_code=400, detail="Số ngày không được vượt quá 3650")
        
#         spark = get_spark()
#         chuyen_bay_df = get_view("chuyen_bay")
#         if chuyen_bay_df is None:
#             chuyen_bay_df = load_df("chuyen_bay")
        
#         chuyen_bay_df.createOrReplaceTempView("chuyen_bay")
        
#         # Query to get old flights
#         old_flights_query = f"""
#         SELECT ma_chuyen_bay, thoi_gian_di, thoi_gian_den
#         FROM chuyen_bay 
#         WHERE thoi_gian_di < '{current_date.isoformat()}'
#         ORDER BY thoi_gian_di DESC
#         """
        
#         df_old_flights = spark.sql(old_flights_query)
#         old_flights_list = df_old_flights.collect()
        
#         if len(old_flights_list) == 0:
#             return JSONResponse(content={
#                 "message": "Không có chuyến bay cũ nào cần cập nhật",
#                 "updated_count": 0,
#                 "days_added": days_to_add
#             })
        
#         print(f"🔍 Tìm thấy {len(old_flights_list)} chuyến bay cũ cần cập nhật")
        
#         updated_count = 0
#         failed_updates = []
        
#         # Process in batches for better performance
#         batch_size = 100
#         for i in range(0, len(old_flights_list), batch_size):
#             batch = old_flights_list[i:i + batch_size]
            
#             for flight in batch:
#                 try:
#                     ma_chuyen_bay = flight["ma_chuyen_bay"]
#                     old_thoi_gian_di = safe_datetime_convert(flight["thoi_gian_di"])
#                     old_thoi_gian_den = safe_datetime_convert(flight["thoi_gian_den"])
                    
#                     # Calculate flight duration
#                     flight_duration = old_thoi_gian_den - old_thoi_gian_di
                    
#                     # Calculate new times
#                     new_thoi_gian_di = old_thoi_gian_di + timedelta(days=days_to_add)
#                     new_thoi_gian_den = new_thoi_gian_di + flight_duration
                    
#                     # Update in MongoDB
#                     result = chuyen_bay_collection.update_one(
#                         {"ma_chuyen_bay": ma_chuyen_bay},
#                         {
#                             "$set": {
#                                 "thoi_gian_di": new_thoi_gian_di,
#                                 "thoi_gian_den": new_thoi_gian_den,
#                                 "updated_at": datetime.now()
#                             }
#                         }
#                     )
                    
#                     if result.modified_count > 0:
#                         updated_count += 1
#                         print(f"✅ Cập nhật {ma_chuyen_bay}: {old_thoi_gian_di} -> {new_thoi_gian_di}")
#                     else:
#                         failed_updates.append(ma_chuyen_bay)
                    
#                 except Exception as flight_error:
#                     print(f"❌ Lỗi cập nhật chuyến bay {flight.get('ma_chuyen_bay', 'N/A')}: {flight_error}")
#                     failed_updates.append(flight.get('ma_chuyen_bay', 'N/A'))
#                     continue
        
#         # Invalidate cache
#         invalidate_cache("chuyen_bay")
        
#         print(f"🎉 Hoàn thành bulk update: {updated_count}/{len(old_flights_list)} chuyến bay")
        
#         return JSONResponse(content={
#             "message": f"Đã cập nhật thành công {updated_count} chuyến bay",
#             "updated_count": updated_count,
#             "total_old_flights": len(old_flights_list),
#             "failed_count": len(failed_updates),
#             "days_added": days_to_add,
#             "new_status": new_status
#         })
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Lỗi bulk update: {repr(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Lỗi cập nhật hàng loạt: {str(e)}")

# @router.post("/generate-future", tags=["chuyen_bay"])
# def generate_future_flights(request: GenerateFutureRequest):
#     """Generate future flights from templates with improved logic"""
#     try:
#         base_date = safe_datetime_convert(request.base_date)
#         days_ahead = request.days_ahead
        
#         # Input validation
#         if days_ahead > 365:
#             raise HTTPException(status_code=400, detail="Không thể tạo lịch bay quá 365 ngày")
        
#         print(f"🚀 Tạo lịch bay tương lai: {days_ahead} ngày từ {base_date}")
        
#         spark = get_spark()
#         chuyen_bay_df = get_view("chuyen_bay")
#         if chuyen_bay_df is None:
#             chuyen_bay_df = load_df("chuyen_bay")
        
#         chuyen_bay_df.createOrReplaceTempView("chuyen_bay")
        
#         # Get template flights (active ones)
#         template_query = """
#         SELECT ma_chuyen_bay, thoi_gian_di, thoi_gian_den, ma_tuyen_bay, ma_hang_bay
#         FROM chuyen_bay 
#         ORDER BY thoi_gian_di DESC
#         LIMIT 20
#         """
        
#         df_templates = spark.sql(template_query)
#         template_flights = df_templates.collect()
        
#         if len(template_flights) == 0:
#             raise HTTPException(status_code=400, detail="Không tìm thấy chuyến bay template để tạo lịch tương lai")
        
#         print(f"📋 Sử dụng {len(template_flights)} chuyến bay làm template")
        
#         new_flights = []
#         created_count = 0
        
#         # Generate flights for specified days
#         for day_offset in range(1, min(days_ahead + 1, 31)):  # Limit to 30 days per batch
#             for template in template_flights:
#                 try:
#                     old_thoi_gian_di = safe_datetime_convert(template["thoi_gian_di"])
#                     old_thoi_gian_den = safe_datetime_convert(template["thoi_gian_den"])
                    
#                     # Calculate new flight times
#                     new_thoi_gian_di = base_date.replace(
#                         hour=old_thoi_gian_di.hour,
#                         minute=old_thoi_gian_di.minute,
#                         second=old_thoi_gian_di.second
#                     ) + timedelta(days=day_offset)
                    
#                     flight_duration = old_thoi_gian_den - old_thoi_gian_di
#                     new_thoi_gian_den = new_thoi_gian_di + flight_duration
                    
#                     # Generate unique flight code
#                     base_code = template["ma_chuyen_bay"][:6]  # Take first 6 chars
#                     new_flight_code = f"{base_code}_{day_offset:02d}{uuid.uuid4().hex[:4].upper()}"
                    
#                     # Create new flight document
#                     new_flight = {
#                         "ma_chuyen_bay": new_flight_code,
#                         "thoi_gian_di": new_thoi_gian_di,
#                         "thoi_gian_den": new_thoi_gian_den,
#                         "ma_tuyen_bay": template["ma_tuyen_bay"],
#                         "ma_hang_bay": template["ma_hang_bay"],
#                         "trang_thai": "Đã lên lịch",
#                         "ngay_tao": datetime.now(),
#                         "generated_from": template["ma_chuyen_bay"],
#                         "is_generated": True
#                     }
                    
#                     new_flights.append(new_flight)
                    
#                 except Exception as flight_error:
#                     print(f"❌ Lỗi tạo chuyến bay từ template {template.get('ma_chuyen_bay', 'N/A')}: {flight_error}")
#                     continue
        
#         # Batch insert to MongoDB
#         if new_flights:
#             try:
#                 result = chuyen_bay_collection.insert_many(new_flights, ordered=False)
#                 created_count = len(result.inserted_ids)
#                 invalidate_cache("chuyen_bay")
#             except Exception as insert_error:
#                 print(f"❌ Lỗi insert batch: {insert_error}")
#                 # Try individual inserts as fallback
#                 for flight in new_flights:
#                     try:
#                         chuyen_bay_collection.insert_one(flight)
#                         created_count += 1
#                     except Exception:
#                         continue
        
#         print(f"🎉 Tạo thành công {created_count} chuyến bay tương lai")
        
#         return JSONResponse(content={
#             "message": f"Đã tạo thành công {created_count} chuyến bay tương lai",
#             "created_count": created_count,
#             "days_ahead": min(days_ahead, 30),
#             "template_count": len(template_flights),
#             "base_date": base_date.isoformat()
#         })
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Lỗi generate future flights: {repr(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Lỗi tạo lịch bay tương lai: {str(e)}")

# @router.get("/stats", tags=["chuyen_bay"])
# def get_flight_stats():
#     """Get flight statistics with enhanced metrics"""
#     try:
#         spark = get_spark()
#         chuyen_bay_df = get_view("chuyen_bay")
#         if chuyen_bay_df is None:
#             chuyen_bay_df = load_df("chuyen_bay")
        
#         chuyen_bay_df.createOrReplaceTempView("chuyen_bay")
        
#         current_date = datetime.now()
        
#         # Enhanced statistics query
#         stats_query = f"""
#         SELECT 
#             COUNT(*) as total_flights,
#             SUM(CASE WHEN thoi_gian_di < '{current_date.isoformat()}' THEN 1 ELSE 0 END) as past_flights,
#             SUM(CASE WHEN thoi_gian_di >= '{current_date.isoformat()}' THEN 1 ELSE 0 END) as future_flights,
#             SUM(CASE WHEN trang_thai = 'Đang hoạt động' THEN 1 ELSE 0 END) as active_flights,
#             SUM(CASE WHEN trang_thai = 'Hủy' THEN 1 ELSE 0 END) as cancelled_flights,
#             SUM(CASE WHEN trang_thai = 'Đã lên lịch' THEN 1 ELSE 0 END) as scheduled_flights,
#             COUNT(DISTINCT ma_hang_bay) as unique_airlines,
#             COUNT(DISTINCT ma_tuyen_bay) as unique_routes
#         FROM chuyen_bay
#         """
        
#         df_stats = spark.sql(stats_query)
#         stats = df_stats.collect()[0].asDict()
        
#         # Add percentage calculations
#         total = stats.get('total_flights', 0)
#         if total > 0:
#             stats['past_percentage'] = round((stats.get('past_flights', 0) / total) * 100, 2)
#             stats['future_percentage'] = round((stats.get('future_flights', 0) / total) * 100, 2)
#             stats['active_percentage'] = round((stats.get('active_flights', 0) / total) * 100, 2)
        
#         return JSONResponse(content=stats)
        
#     except Exception as e:
#         print(f"❌ Lỗi lấy thống kê: {repr(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Lỗi lấy thống kê chuyến bay")

# @router.delete("/{ma_chuyen_bay}", tags=["chuyen_bay"])
# def delete_chuyen_bay(ma_chuyen_bay: str):
#     """Delete flight with validation"""
#     try:
#         print(f"🗑 Nhận yêu cầu xóa chuyến bay: {ma_chuyen_bay}")

#         # Check if flight exists
#         if not check_exists_optimized("chuyen_bay", "ma_chuyen_bay", ma_chuyen_bay):
#             raise HTTPException(status_code=404, detail="Không tìm thấy chuyến bay")

#         # Delete document
#         result = chuyen_bay_collection.delete_one({"ma_chuyen_bay": ma_chuyen_bay})

#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Không tìm thấy chuyến bay")

#         # Invalidate cache
#         invalidate_cache("chuyen_bay")

#         print(f"✅ Xóa chuyến bay thành công: {ma_chuyen_bay}")
#         return JSONResponse(content={"message": f"Xóa chuyến bay {ma_chuyen_bay} thành công"})

#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Lỗi trong delete_chuyen_bay: {repr(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
