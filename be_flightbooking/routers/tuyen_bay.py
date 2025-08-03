from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.tuyen_bay import TuyenBay
from utils.spark import invalidate_cache, load_df, get_spark
from utils.spark_views import cached_views, get_view
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
tuyen_bay_collection = db["tuyen_bay"]

def check_san_bay_exists(ma_san_bay: str) -> bool:
    """Optimized function to check if airport exists"""
    try:
        # Ưu tiên sử dụng cached view
        df_san_bay = get_view("san_bay")
        if df_san_bay is None:
            df_san_bay = load_df("san_bay")
        
        # Sử dụng limit(1) để tối ưu performance
        return df_san_bay.filter(df_san_bay["ma_san_bay"] == ma_san_bay).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_san_bay_exists: {e}")
        return False

def check_tuyen_bay_duplicate(ma_tuyen_bay: str) -> bool:
    """Check if flight route already exists"""
    try:
        df_tuyen = get_view("tuyen_bay")
        if df_tuyen is None:
            df_tuyen = load_df("tuyen_bay")
        
        return df_tuyen.filter(df_tuyen["ma_tuyen_bay"] == ma_tuyen_bay).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_tuyen_bay_duplicate: {e}")
        return False

@router.post("", tags=["tuyen_bay"])
def add_tuyen_bay(tuyen_bay: TuyenBay):
    """Add new flight route with optimized validation"""
    try:
        print(f"🔥 Nhận yêu cầu POST /add: {tuyen_bay.ma_tuyen_bay}")
        print(f"📥 Dữ liệu: {tuyen_bay.dict()}")

        # Input validation
        if not tuyen_bay.ma_tuyen_bay or not tuyen_bay.ma_tuyen_bay.strip():
            raise HTTPException(status_code=400, detail="Mã tuyến bay không được để trống")

        if tuyen_bay.ma_san_bay_di == tuyen_bay.ma_san_bay_den:
            raise HTTPException(status_code=400, detail="Sân bay đi và đến không được giống nhau")

        # Batch validation để giảm số lần query
        validations = [
            (check_san_bay_exists(tuyen_bay.ma_san_bay_di), "Sân bay đi không tồn tại"),
            (check_san_bay_exists(tuyen_bay.ma_san_bay_den), "Sân bay đến không tồn tại"),
            (not check_tuyen_bay_duplicate(tuyen_bay.ma_tuyen_bay), "Mã tuyến bay đã tồn tại")
        ]

        for is_valid, error_msg in validations:
            if not is_valid:
                raise HTTPException(status_code=400, detail=error_msg)

        # Insert với duplicate key handling
        try:
            result = tuyen_bay_collection.insert_one(tuyen_bay.dict())
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm tuyến bay")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã tuyến bay đã tồn tại")

        # Invalidate cache sau khi insert thành công
        invalidate_cache("tuyen_bay")

        print(f"🎉 Thêm tuyến bay thành công: {tuyen_bay.ma_tuyen_bay}")
        return JSONResponse(
            content={
                "message": "Thêm tuyến bay thành công",
                "ma_tuyen_bay": tuyen_bay.ma_tuyen_bay,
                "_id": str(result.inserted_id)
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_tuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["tuyen_bay"])
def get_all_tuyen_bay():
    """Get all flight routes with airport details using optimized SQL"""
    try:
        spark = get_spark()
        
        tuyen_bay_df = get_view("tuyen_bay")
        san_bay_df = get_view("san_bay")
        
        if tuyen_bay_df is None or san_bay_df is None:
            print("⚠️ Views không tồn tại, reload DataFrame...")
            tuyen_bay_df = load_df("tuyen_bay")
            san_bay_df = load_df("san_bay")
        
        # Recreate temp views
        tuyen_bay_df.createOrReplaceTempView("tuyen_bay")
        san_bay_df.createOrReplaceTempView("san_bay")

        # Fixed SQL query - đổi quoc_gia thành ma_quoc_gia
        query = """
        SELECT 
            tb.ma_tuyen_bay,
            tb.ma_san_bay_di,
            sbd.ten_san_bay AS ten_san_bay_di,
            sbd.thanh_pho AS thanh_pho_di,
            sbd.ma_quoc_gia AS quoc_gia_di,
            tb.ma_san_bay_den,
            sbden.ten_san_bay AS ten_san_bay_den,
            sbden.thanh_pho AS thanh_pho_den,
            sbden.ma_quoc_gia AS quoc_gia_den,
            CONCAT(sbd.thanh_pho, ' → ', sbden.thanh_pho) AS route_display
        FROM tuyen_bay tb
        LEFT JOIN san_bay sbd ON tb.ma_san_bay_di = sbd.ma_san_bay
        LEFT JOIN san_bay sbden ON tb.ma_san_bay_den = sbden.ma_san_bay
        ORDER BY tb.ma_tuyen_bay
        """

        df_result = spark.sql(query)
        
        try:
            result = df_result.toPandas().to_dict(orient="records")
            print(f"✅ Lấy danh sách tuyến bay thành công: {len(result)} records")
            return JSONResponse(content=result)
        except Exception as pandas_error:
            print(f"❌ Lỗi convert pandas: {pandas_error}")
            rows = df_result.collect()
            result = [row.asDict() for row in rows]
            return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_tuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

    except Exception as e:
        print(f"❌ Lỗi trong get_all_tuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_tuyen_bay}", tags=["tuyen_bay"])
def get_tuyen_bay_by_id(ma_tuyen_bay: str):
    """Get flight route by ID with airport details"""
    try:
        spark = get_spark()
        
        # Ensure views exist
        tuyen_bay_df = get_view("tuyen_bay")
        san_bay_df = get_view("san_bay")
        
        if tuyen_bay_df is None or san_bay_df is None:
            tuyen_bay_df = load_df("tuyen_bay")
            san_bay_df = load_df("san_bay")
        
        tuyen_bay_df.createOrReplaceTempView("tuyen_bay")
        san_bay_df.createOrReplaceTempView("san_bay")

        query = f"""
        SELECT 
            tb.ma_tuyen_bay,
            tb.ma_san_bay_di,
            sbd.ten_san_bay AS ten_san_bay_di,
            sbd.thanh_pho AS thanh_pho_di,
            tb.ma_san_bay_den,
            sbden.ten_san_bay AS ten_san_bay_den,
            sbden.thanh_pho AS thanh_pho_den
        FROM tuyen_bay tb
        LEFT JOIN san_bay sbd ON tb.ma_san_bay_di = sbd.ma_san_bay
        LEFT JOIN san_bay sbden ON tb.ma_san_bay_den = sbden.ma_san_bay
        WHERE tb.ma_tuyen_bay = '{ma_tuyen_bay}'
        """

        df_result = spark.sql(query)
        
        if df_result.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay")
        
        result = df_result.toPandas().to_dict(orient="records")[0]
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_tuyen_bay_by_id: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.put("/{ma_tuyen_bay}", tags=["tuyen_bay"])
def update_tuyen_bay(ma_tuyen_bay: str, tuyen_bay: TuyenBay):
    """Update flight route with validation"""
    try:
        print(f"🔄 Cập nhật tuyến bay: {ma_tuyen_bay}")
        
        # Check if route exists
        if not check_tuyen_bay_duplicate(ma_tuyen_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay")

        # Validate airports
        if tuyen_bay.ma_san_bay_di == tuyen_bay.ma_san_bay_den:
            raise HTTPException(status_code=400, detail="Sân bay đi và đến không được giống nhau")

        if not check_san_bay_exists(tuyen_bay.ma_san_bay_di):
            raise HTTPException(status_code=400, detail="Sân bay đi không tồn tại")

        if not check_san_bay_exists(tuyen_bay.ma_san_bay_den):
            raise HTTPException(status_code=400, detail="Sân bay đến không tồn tại")

        # Update document
        update_data = tuyen_bay.dict()
        update_data["ma_tuyen_bay"] = ma_tuyen_bay  # Ensure consistency

        result = tuyen_bay_collection.update_one(
            {"ma_tuyen_bay": ma_tuyen_bay},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay")

        invalidate_cache("tuyen_bay")
        
        print(f"✅ Cập nhật tuyến bay thành công: {ma_tuyen_bay}")
        return JSONResponse(content={"message": "Cập nhật tuyến bay thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong update_tuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_tuyen_bay}", tags=["tuyen_bay"])
def delete_tuyen_bay(ma_tuyen_bay: str):
    """Delete flight route with validation"""
    try:
        print(f"🗑 Xóa tuyến bay: {ma_tuyen_bay}")
        
        # Check if route exists before deleting
        if not check_tuyen_bay_duplicate(ma_tuyen_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay")

        result = tuyen_bay_collection.delete_one({"ma_tuyen_bay": ma_tuyen_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay")

        invalidate_cache("tuyen_bay")

        print(f"✅ Xóa tuyến bay thành công: {ma_tuyen_bay}")
        return JSONResponse(content={"message": f"Xóa tuyến bay {ma_tuyen_bay} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong delete_tuyen_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
