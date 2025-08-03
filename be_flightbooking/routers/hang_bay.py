from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_bay import HangBay
from utils.spark import load_df, invalidate_cache
from utils.spark_views import get_view
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_bay_collection = client[MONGO_DB]["hang_bay"]

def check_hang_bay_exists(ma_hang_bay: str) -> bool:
    """Optimized function to check if airline exists"""
    try:
        # Ưu tiên sử dụng cached view
        df = get_view("hang_bay")
        if df is None:
            df = load_df("hang_bay")
        
        # Sử dụng limit(1) để tối ưu performance
        return df.filter(df["ma_hang_bay"] == ma_hang_bay).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_hang_bay_exists: {e}")
        return False

@router.post("", tags=["hang_bay"])
def add_hang_bay(hang_bay: HangBay):
    """Add new airline with optimized validation"""
    try:
        print(f"🔥 Nhận yêu cầu POST /add: {hang_bay.ma_hang_bay}")
        print(f"📥 Dữ liệu: {hang_bay.dict()}")

        # Input validation
        if not hang_bay.ma_hang_bay or not hang_bay.ma_hang_bay.strip():
            raise HTTPException(status_code=400, detail="Mã hãng bay không được để trống")

        if not hang_bay.ten_hang_bay or not hang_bay.ten_hang_bay.strip():
            raise HTTPException(status_code=400, detail="Tên hãng bay không được để trống")

        # Tối ưu duplicate check
        if check_hang_bay_exists(hang_bay.ma_hang_bay):
            raise HTTPException(status_code=400, detail="Mã hãng bay đã tồn tại")

        # Insert với duplicate key handling
        try:
            data_to_insert = hang_bay.dict()
            result = hang_bay_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm hãng bay")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã hãng bay đã tồn tại")

        # Invalidate cache sau khi insert thành công
        invalidate_cache("hang_bay")

        print(f"🎉 Thêm hãng bay thành công: {hang_bay.ma_hang_bay}")
        return JSONResponse(
            content={
                "message": "Thêm hãng bay thành công",
                "ma_hang_bay": hang_bay.ma_hang_bay,
                "_id": str(result.inserted_id)
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_hang_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["hang_bay"])
def get_all_hang_bay():
    """Get all airlines with optimized query"""
    try:
        # Sử dụng cached view nếu có
        df = get_view("hang_bay")
        if df is None:
            df = load_df("hang_bay")

        # Debug: Kiểm tra columns available
        available_columns = df.columns
        print(f"📋 Available columns in hang_bay: {available_columns}")

        # Select chỉ những field tồn tại và cần thiết
        columns_to_select = []
        possible_columns = ["ma_hang_bay", "ten_hang_bay", "iata_code", "quoc_gia", "ma_quoc_gia"]
        
        for col in possible_columns:
            if col in available_columns:
                columns_to_select.append(col)

        if not columns_to_select:
            # Fallback: select all columns
            selected_df = df
        else:
            selected_df = df.select(*columns_to_select)

        # Sắp xếp theo mã hãng bay
        result_df = selected_df.orderBy("ma_hang_bay")
        result = result_df.toPandas().to_dict(orient="records")

        print(f"✅ Lấy danh sách hãng bay thành công: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_hang_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_hang_bay}", tags=["hang_bay"])
def get_hang_bay_by_id(ma_hang_bay: str):
    """Get airline by ma_hang_bay with optimized query"""
    try:
        df = get_view("hang_bay")
        if df is None:
            df = load_df("hang_bay")

        # Filter với limit để tối ưu performance
        filtered_df = df.filter(df["ma_hang_bay"] == ma_hang_bay).limit(1)
        
        if filtered_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay")
        
        result = filtered_df.toPandas().to_dict(orient="records")[0]
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_hang_bay_by_id: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.put("/{ma_hang_bay}", tags=["hang_bay"])
def update_hang_bay(ma_hang_bay: str, hang_bay: HangBay):
    """Update airline with validation"""
    try:
        print(f"🔄 Cập nhật hãng bay: {ma_hang_bay}")

        # Check if airline exists
        if not check_hang_bay_exists(ma_hang_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay")

        # Input validation
        if not hang_bay.ten_hang_bay or not hang_bay.ten_hang_bay.strip():
            raise HTTPException(status_code=400, detail="Tên hãng bay không được để trống")

        # Update document
        update_data = hang_bay.dict()
        update_data["ma_hang_bay"] = ma_hang_bay  # Ensure ma_hang_bay matches URL param

        result = hang_bay_collection.update_one(
            {"ma_hang_bay": ma_hang_bay},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay")

        # Invalidate cache
        invalidate_cache("hang_bay")

        print(f"✅ Cập nhật hãng bay thành công: {ma_hang_bay}")
        return JSONResponse(content={"message": "Cập nhật hãng bay thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong update_hang_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_hang_bay}", tags=["hang_bay"])
def delete_hang_bay(ma_hang_bay: str):
    """Delete airline with validation"""
    try:
        print(f"🗑 Nhận yêu cầu xóa hãng bay: {ma_hang_bay}")

        # Check if airline exists before deleting
        if not check_hang_bay_exists(ma_hang_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay")

        # TODO: Kiểm tra xem hãng bay có đang được sử dụng trong chuyến bay không
        # df_chuyen = get_view("chuyen_bay")
        # if df_chuyen is not None:
        #     in_use = df_chuyen.filter(df_chuyen["ma_hang_bay"] == ma_hang_bay).limit(1).count() > 0
        #     if in_use:
        #         raise HTTPException(status_code=400, detail="Không thể xóa hãng bay đang được sử dụng trong chuyến bay")

        # Delete document
        result = hang_bay_collection.delete_one({"ma_hang_bay": ma_hang_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bay")

        # Invalidate cache
        invalidate_cache("hang_bay")

        print(f"✅ Xóa hãng bay thành công: {ma_hang_bay}")
        return JSONResponse(content={"message": f"Xóa hãng bay {ma_hang_bay} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong delete_hang_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/search/{keyword}", tags=["hang_bay"])
def search_hang_bay(keyword: str):
    """Search airlines by keyword (name or code)"""
    try:
        df = get_view("hang_bay")
        if df is None:
            df = load_df("hang_bay")

        # Search in multiple fields
        filtered_df = df.filter(
            (df["ten_hang_bay"].contains(keyword)) |
            (df["ma_hang_bay"].contains(keyword.upper())) |
            (df["iata_code"].contains(keyword.upper()) if "iata_code" in df.columns else False)
        ).orderBy("ten_hang_bay")

        result = filtered_df.toPandas().to_dict(orient="records")
        
        print(f"🔍 Tìm kiếm hãng bay '{keyword}': {len(result)} kết quả")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong search_hang_bay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/debug/schema", tags=["hang_bay"])
def debug_schema():
    """Debug endpoint to check actual database schema"""
    try:
        df = get_view("hang_bay")
        if df is None:
            df = load_df("hang_bay")
        
        # In ra tất cả column names
        columns = df.columns
        print(f"📋 Actual columns in hang_bay: {columns}")
        
        # Lấy 1 record để xem cấu trúc
        sample = df.limit(1).toPandas().to_dict(orient="records")
        
        return JSONResponse(content={
            "columns": columns,
            "sample_record": sample[0] if sample else None
        })
    except Exception as e:
        print(f"❌ Debug error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
