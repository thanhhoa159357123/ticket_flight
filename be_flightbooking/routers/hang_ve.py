from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hangve import HangVe
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_URI, MONGO_DB
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_ve_collection = client[MONGO_DB]["hangve"]

# ============================== #
# 🔍 UTIL: Check tồn tại bằng Spark cache
# ============================== #
def get_hang_ve_from_cache(ma_hang_ve: str):
    try:
        df = load_df("hangve")
        return df.filter(df["ma_hang_ve"] == ma_hang_ve).limit(1)
    except Exception as e:
        print(f"❌ Lỗi khi load cache hangve: {repr(e)}")
        return None

def check_hang_ve_exists(ma_hang_ve: str) -> bool:
    df = get_hang_ve_from_cache(ma_hang_ve)
    return df is not None and df.count() > 0

# ============================== #
# 📌 POST: Thêm mới
# ============================== #
@router.post("", tags=["hangve"])
def add_hang_ve(hangve: HangVe):
    try:
        data = hangve.dict()
        print(f"📥 Nhận dữ liệu mới: {data}")

        if not data["ma_hang_ve"].strip() or not data["ten_hang_ve"].strip():
            raise HTTPException(status_code=400, detail="Thông tin không hợp lệ")

        if check_hang_ve_exists(data["ma_hang_ve"]):
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")

        try:
            result = hang_ve_collection.insert_one(data)
            data["_id"] = str(result.inserted_id)
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")

        invalidate_cache("hangve")
        print(f"✅ Đã thêm hạng vé: {data['ma_hang_ve']}")
        return JSONResponse(content={"message": "Thêm hạng vé thành công", **data}, status_code=201)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi POST: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# ============================== #
# 📌 GET: Tất cả
# ============================== #
@router.get("", tags=["hangve"])
def get_all_hang_ve():
    try:
        df = load_df("hangve").select(
            "ma_hang_ve", "ten_hang_ve", "so_kg_hanh_ly_ky_gui",
            "so_kg_hanh_ly_xach_tay", "so_do_ghe", "khoang_cach_ghe",
            "refundable", "changeable"
        )
        result = df.toPandas().to_dict(orient="records")
        print(f"✅ Tải {len(result)} hạng vé từ cache")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi GET all: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# ============================== #
# 📌 GET: Theo mã
# ============================== #
@router.get("/{ma_hang_ve}", tags=["hangve"])
def get_hang_ve_by_id(ma_hang_ve: str):
    try:
        df = get_hang_ve_from_cache(ma_hang_ve)
        if not df or df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        result = df.toPandas().to_dict(orient="records")[0]
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi GET by id: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# ============================== #
# 📌 PUT: Cập nhật
# ============================== #
@router.put("/{ma_hang_ve}", tags=["hangve"])
def update_hang_ve(ma_hang_ve: str, hangve: HangVe):
    try:
        df = get_hang_ve_from_cache(ma_hang_ve)
        if not df or df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        update_data = hangve.dict()
        update_data["ma_hang_ve"] = ma_hang_ve

        result = hang_ve_collection.update_one(
            {"ma_hang_ve": ma_hang_ve}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        invalidate_cache("hangve")
        print(f"✅ Cập nhật thành công: {ma_hang_ve}")
        return JSONResponse(content={"message": "Cập nhật hạng vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi PUT: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# ============================== #
# 📌 DELETE: Xoá
# ============================== #
@router.delete("/{ma_hang_ve}", tags=["hangve"])
def delete_hang_ve(ma_hang_ve: str):
    try:
        df = get_hang_ve_from_cache(ma_hang_ve)
        if not df or df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        result = hang_ve_collection.delete_one({"ma_hang_ve": ma_hang_ve})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        invalidate_cache("hangve")
        print(f"✅ Đã xoá hạng vé: {ma_hang_ve}")
        return JSONResponse(content={"message": "Xoá hạng vé thành công"})

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi DELETE: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
