from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_ve import HangVe
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_URI, MONGO_DB
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_ve_collection = client[MONGO_DB]["hang_ve"]

# Cache DataFrame để tái sử dụng
_cached_df = None

def get_cached_hang_ve_df():
    """Get cached DataFrame or load new one"""
    global _cached_df
    if _cached_df is None or not _cached_df.is_cached:
        _cached_df = load_df("hang_ve")
        _cached_df = _cached_df.cache()
    return _cached_df

@router.get("", tags=["hang_ve"])
def get_all_hang_ve():
    """Get all hang ve with optimized query"""
    try:
        # Sử dụng cached DataFrame
        df = get_cached_hang_ve_df()
        
        # Select chỉ những field cần thiết
        selected_df = df.select(
            "ma_hang_ve",
            "vi_tri_ngoi", 
            "so_kg_hanh_ly_ky_gui",
            "so_kg_hanh_ly_xach_tay",
            "so_do_ghe",
            "khoang_cach_ghe",
            "refundable",
            "changeable"
        )
        
        # Tối ưu conversion sang dictionary
        result = selected_df.toPandas().to_dict(orient="records")
        
        print(f"✅ Lấy danh sách hạng vé thành công: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi trong get_all_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_hang_ve}", tags=["hang_ve"])
def get_hang_ve_by_id(ma_hang_ve: str):
    """Get hang ve by ma_hang_ve with optimized query"""
    try:
        df = get_cached_hang_ve_df()
        
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

@router.post("", tags=["hang_ve"])
def add_hang_ve(hang_ve: HangVe):
    """Add new hang ve with optimized validation"""
    try:
        print(f"📥 Dữ liệu nhận từ client: {hang_ve.dict()}")
        
        # Validate mã hạng vé không được rỗng
        if not hang_ve.ma_hang_ve or not hang_ve.ma_hang_ve.strip():
            raise HTTPException(status_code=400, detail="Mã hạng vé không được để trống")
        
        # Tối ưu check duplicate - sử dụng limit(1)
        df = get_cached_hang_ve_df()
        existing_df = df.filter(df["ma_hang_ve"] == hang_ve.ma_hang_ve).limit(1)
        
        if existing_df.count() > 0:
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")

        # Insert với error handling
        try:
            result = hang_ve_collection.insert_one(hang_ve.dict())
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể thêm hạng vé")
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")

        # Invalidate cache sau khi insert thành công
        global _cached_df
        _cached_df = None
        invalidate_cache("hang_ve")

        print(f"✅ Thêm hạng vé thành công: {hang_ve.ma_hang_ve}")
        return JSONResponse(
            content={
                "message": "Thêm hạng vé thành công", 
                "ma_hang_ve": hang_ve.ma_hang_ve,
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

@router.put("/{ma_hang_ve}", tags=["hang_ve"])
def update_hang_ve(ma_hang_ve: str, hang_ve: HangVe):
    """Update hang ve with validation"""
    try:
        # Check if hang ve exists
        df = get_cached_hang_ve_df()
        existing_df = df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1)
        
        if existing_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        # Update document
        update_data = hang_ve.dict()
        update_data["ma_hang_ve"] = ma_hang_ve  # Ensure ma_hang_ve matches URL param
        
        result = hang_ve_collection.update_one(
            {"ma_hang_ve": ma_hang_ve},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        # Invalidate cache
        global _cached_df
        _cached_df = None
        invalidate_cache("hang_ve")

        print(f"✅ Cập nhật hạng vé thành công: {ma_hang_ve}")
        return JSONResponse(content={"message": "Cập nhật hạng vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong update_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_hang_ve}", tags=["hang_ve"])
def delete_hang_ve(ma_hang_ve: str):
    """Delete hang ve with validation"""
    try:
        # Check if hang ve exists
        df = get_cached_hang_ve_df()
        existing_df = df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1)
        
        if existing_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        # Delete document
        result = hang_ve_collection.delete_one({"ma_hang_ve": ma_hang_ve})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        # Invalidate cache
        global _cached_df
        _cached_df = None
        invalidate_cache("hang_ve")

        print(f"✅ Xóa hạng vé thành công: {ma_hang_ve}")
        return JSONResponse(content={"message": "Xóa hạng vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi trong delete_hang_ve: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
