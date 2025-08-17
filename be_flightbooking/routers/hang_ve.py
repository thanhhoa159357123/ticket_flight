from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hangve import HangVe
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from utils.spark import load_df, refresh_cache
from utils.env_loader import MONGO_URI, MONGO_DB
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_ve_collection = client[MONGO_DB]["hangve"]

def check_hang_ve_exists(ma_hang_ve: str) -> bool:
    """Optimized function to check if hang ve exists using cache"""
    try:
        df = load_df("hangve")
        return df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1).count() > 0
    except Exception as e:
        print(f"❌ Lỗi check_hang_ve_exists: {e}")
        return False

@router.post("", tags=["hangve"])
def add_hang_ve(hangve: HangVe):
    """Add new hang ve with optimized validation"""
    try:
        print(f"📥 Dữ liệu nhận từ client: {hangve.dict()}")
        
        # Input validation
        if not hangve.ma_hang_ve or not hangve.ma_hang_ve.strip():
            raise HTTPException(status_code=400, detail="Mã hạng vé không được để trống")

        if not hangve.ten_hang_ve or not hangve.ten_hang_ve.strip():
            raise HTTPException(status_code=400, detail="Tên hạng vé không được để trống")

        # Check duplicate using cached DataFrame
        if check_hang_ve_exists(hangve.ma_hang_ve):
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")
        
        # Insert với error handling
        try:
            data_to_insert = hangve.dict()
            result = hang_ve_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm hạng vé")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")

        # Refresh cache để có dữ liệu mới ngay lập tức
        refresh_cache("hangve")

        print(f"✅ Thêm hạng vé thành công: {hangve.ma_hang_ve}")
        return JSONResponse(
            content={
                "message": "Thêm hạng vé thành công", 
                "ma_hang_ve": hangve.ma_hang_ve,
                "_id": str(result.inserted_id)
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong add_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["hangve"])
def get_all_hang_ve():
    """Get all hang ve with optimized query"""
    try:
        # Sử dụng cached DataFrame
        df = load_df("hangve")
        
        # Select chỉ những field cần thiết
        selected_df = df.select(
            "ma_hang_ve",
            "ten_hang_ve", 
            "so_kg_hanh_ly_ky_gui",
            "so_kg_hanh_ly_xach_tay",
            "so_do_ghe",
            "khoang_cach_ghe",
            "refundable",
            "changeable"
        )
        
        # Tối ưu conversion sang dictionary
        result = selected_df.toPandas().to_dict(orient="records")
        
        print(f"✅ Lấy danh sách hạng vé thành công từ cache: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_hang_ve}", tags=["hangve"])
def get_hang_ve_by_id(ma_hang_ve: str):
    """Get hang ve by ma_hang_ve with optimized query"""
    try:
        df = load_df("hangve")
        
        # Filter với limit để tối ưu performance
        filtered_df = df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1)
        
        if filtered_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")
        
        result = filtered_df.toPandas().to_dict(orient="records")[0]
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong get_hang_ve_by_id: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.put("/{ma_hang_ve}", tags=["hangve"])
def update_hang_ve(ma_hang_ve: str, hangve: HangVe):
    """Update hang ve with validation"""
    try:
        # Check if hang ve exists
        df = load_df("hangve")
        existing_df = df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1)
        
        if existing_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        # Update document
        update_data = hangve.dict()
        update_data["ma_hang_ve"] = ma_hang_ve  # Ensure ma_hang_ve matches URL param
        
        result = hang_ve_collection.update_one(
            {"ma_hang_ve": ma_hang_ve},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        _cached_df = None
        refresh_cache("hangve")

        print(f"✅ Cập nhật hạng vé thành công: {ma_hang_ve}")
        return JSONResponse(content={"message": "Cập nhật hạng vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong update_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_hang_ve}", tags=["hangve"])
def delete_hang_ve(ma_hang_ve: str):
    """Delete hang ve with validation"""
    try:
        # Check if hang ve exists
        df = load_df("hangve")
        existing_df = df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1)
        
        if existing_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        # Delete document
        result = hang_ve_collection.delete_one({"ma_hang_ve": ma_hang_ve})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        refresh_cache("hangve")

        print(f"✅ Xóa hạng vé thành công: {ma_hang_ve}")
        return JSONResponse(content={"message": "Xóa hạng vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong delete_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
