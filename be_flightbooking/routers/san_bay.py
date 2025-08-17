from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.sanbay import SanBay
from utils.spark import load_df, refresh_cache
from utils.spark_views import get_view
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
sanbay_collection = client[MONGO_DB]["sanbay"]

def check_sanbay_exists(ma_san_bay: str) -> bool:
    """Optimized function to check if airport exists using cache"""
    try:
        df = load_df("sanbay")
        return df.filter(df["ma_san_bay"] == ma_san_bay).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_sanbay_exists: {e}")
        return False

@router.post("", tags=["sanbay"])
def add_sanbay(sanbay: SanBay):
    """Add new airport with optimized validation"""
    try:
        print(f"📥 Dữ liệu nhận từ client: {sanbay.dict()}")

        # Input validation
        if not sanbay.ma_san_bay or not sanbay.ma_san_bay.strip():
            raise HTTPException(status_code=400, detail="Mã sân bay không được để trống")

        if not sanbay.ten_san_bay or not sanbay.ten_san_bay.strip():
            raise HTTPException(status_code=400, detail="Tên sân bay không được để trống")

        # Tối ưu duplicate check với cached DataFrame
        if check_sanbay_exists(sanbay.ma_san_bay):
            raise HTTPException(status_code=400, detail="Mã sân bay đã tồn tại")

        # Insert với duplicate key handling
        try:
            data_to_insert = sanbay.dict()
            result = sanbay_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm sân bay")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã sân bay đã tồn tại")

        # Refresh cache để có dữ liệu mới ngay lập tức
        refresh_cache("sanbay")

        print(f"✅ Thêm sân bay thành công: {sanbay.ma_san_bay}")
        return JSONResponse(
            content={
                "message": "Thêm sân bay thành công",
                "ma_san_bay": sanbay.ma_san_bay,
                "_id": str(result.inserted_id)
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_sanbay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["sanbay"])
def get_all_sanbay():
    """Get all airports with optimized query"""
    try:
        # Sử dụng cached DataFrame
        df = load_df("sanbay")

        # Select chỉ những field cần thiết và sắp xếp
        selected_df = df.select(
            "ma_san_bay",
            "ten_san_bay", 
            "thanh_pho",
            "ma_quoc_gia",
            "iata_code"
        ).orderBy("ten_san_bay")

        # Tối ưu conversion sang dictionary
        result = selected_df.toPandas().to_dict(orient="records")
        
        print(f"✅ Lấy danh sách sân bay thành công từ cache: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_sanbay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_san_bay}", tags=["sanbay"])
def get_sanbay_by_id(ma_san_bay: str):
    """Get airport by ma_san_bay with optimized query"""
    try:
        df = get_view("sanbay")
        if df is None:
            df = load_df("sanbay")

        # Filter với limit để tối ưu performance
        filtered_df = df.filter(df["ma_san_bay"] == ma_san_bay).limit(1)
        
        if filtered_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay")
        
        result = filtered_df.toPandas().to_dict(orient="records")[0]
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_sanbay_by_id: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.put("/{ma_san_bay}", tags=["sanbay"])
def update_sanbay(ma_san_bay: str, sanbay: SanBay):
    """Update airport with validation"""
    try:
        print(f"🔄 Cập nhật sân bay: {ma_san_bay}")

        # Check if airport exists
        if not check_sanbay_exists(ma_san_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay")

        # Input validation
        if not sanbay.ten_sanbay or not sanbay.ten_sanbay.strip():
            raise HTTPException(status_code=400, detail="Tên sân bay không được để trống")

        # Update document
        update_data = sanbay.dict()
        update_data["ma_san_bay"] = ma_san_bay  # Ensure ma_san_bay matches URL param

        result = sanbay_collection.update_one(
            {"ma_san_bay": ma_san_bay},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay")

        # Invalidate cache
        refresh_cache("sanbay")

        print(f"✅ Cập nhật sân bay thành công: {ma_san_bay}")
        return JSONResponse(content={"message": "Cập nhật sân bay thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong update_sanbay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_san_bay}", tags=["sanbay"])
def delete_sanbay(ma_san_bay: str):
    """Delete airport with validation"""
    try:
        print(f"🗑 Nhận yêu cầu xóa sân bay: {ma_san_bay}")

        # Check if airport exists before deleting
        if not check_sanbay_exists(ma_san_bay):
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay")

        # TODO: Kiểm tra xem sân bay có đang được sử dụng trong tuyến bay không
        # df_tuyen = get_view("tuyen_bay")
        # if df_tuyen is not None:
        #     in_use = df_tuyen.filter(
        #         (df_tuyen["ma_san_bay_di"] == ma_san_bay) |
        #         (df_tuyen["ma_san_bay_den"] == ma_san_bay)
        #     ).limit(1).count() > 0
        #     if in_use:
        #         raise HTTPException(status_code=400, detail="Không thể xóa sân bay đang được sử dụng trong tuyến bay")

        # Delete document
        result = sanbay_collection.delete_one({"ma_san_bay": ma_san_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay")

        # Invalidate cache
        refresh_cache("sanbay")

        print(f"✅ Xóa sân bay thành công: {ma_san_bay}")
        return JSONResponse(content={"message": f"Xóa sân bay {ma_san_bay} thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong delete_sanbay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/search/{keyword}", tags=["sanbay"])
def search_sanbay(keyword: str):
    """Search airports by keyword (name, city, or code)"""
    try:
        df = get_view("sanbay")
        if df is None:
            df = load_df("sanbay")

        # Search in multiple fields
        keyword_lower = keyword.lower()
        filtered_df = df.filter(
            (df["ten_sanbay"].contains(keyword)) |
            (df["thanh_pho"].contains(keyword)) |
            (df["ma_san_bay"].contains(keyword.upper())) |
            (df["iata_code"].contains(keyword.upper()))
        ).select(
            "ma_san_bay",
            "ten_sanbay",
            "thanh_pho", 
            "ma_quoc_gia",
            "iata_code"
        ).orderBy("ten_sanbay")

        result = filtered_df.toPandas().to_dict(orient="records")
        
        print(f"🔍 Tìm kiếm sân bay '{keyword}': {len(result)} kết quả")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong search_sanbay: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
