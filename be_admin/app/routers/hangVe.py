from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.hang_ve import HangVe
from utils.spark import load_df, invalidate_cache
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB
from pymongo import MongoClient
import traceback

router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
hang_ve_collection = client[DATA_MONGO_DB]["hang_ve"]

# GET all
@router.get("", tags=["hang_ve"])
def get_all_hang_ve():
    try:
        df = load_df("hang_ve")
        df = df.select(
            "ma_hang_ve", "vi_tri_ngoi",
            "so_kg_hanh_ly_ky_gui", "so_kg_hanh_ly_xach_tay",
            "so_do_ghe", "khoang_cach_ghe",
            "refundable", "changeable"
        )
        result = df.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# GET by ma_hang_ve
@router.get("/{ma_hang_ve}", tags=["hang_ve"])
def get_hang_ve_by_id(ma_hang_ve: str):
    try:
        df = load_df("hang_ve")
        filtered = df.filter(df["ma_hang_ve"] == ma_hang_ve)
        pd_result = filtered.toPandas().to_dict(orient="records")
        if not pd_result:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")
        return JSONResponse(content=pd_result[0])
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# POST
@router.post("", tags=["hang_ve"])
def add_hang_ve(hang_ve: HangVe):
    try:
        df = load_df("hang_ve")
        if (
            "ma_hang_ve" in df.columns
            and df.filter(df["ma_hang_ve"] == hang_ve.ma_hang_ve).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hạng vé đã tồn tại")

        data_to_insert = hang_ve.dict()
        inserted = hang_ve_collection.insert_one(data_to_insert)
        invalidate_cache("hang_ve")
        data_to_insert["_id"] = str(inserted.inserted_id)
        return JSONResponse(content={
            "message": "Thêm hạng vé thành công",
            "hang_ve": data_to_insert
        })
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# PUT
@router.put("/{ma_hang_ve}", tags=["hang_ve"])
def update_hang_ve(ma_hang_ve: str, updated_data: dict = Body(...)):
    try:
        existing = hang_ve_collection.find_one({"ma_hang_ve": ma_hang_ve})
        if not existing:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé")

        if "ma_hang_ve" in updated_data:
            updated_data.pop("ma_hang_ve")

        result = hang_ve_collection.update_one(
            {"ma_hang_ve": ma_hang_ve},
            {"$set": updated_data}
        )
        invalidate_cache("hang_ve")
        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào được thực hiện"})
        return JSONResponse(content={"message": f"Cập nhật hạng vé {ma_hang_ve} thành công"})
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# DELETE
@router.delete("/{ma_hang_ve}", tags=["hang_ve"])
def delete_hang_ve(ma_hang_ve: str):
    try:
        result = hang_ve_collection.delete_one({"ma_hang_ve": ma_hang_ve})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hạng vé để xoá")
        invalidate_cache("hang_ve")
        return JSONResponse(content={"message": f"Đã xoá hạng vé {ma_hang_ve} thành công"})
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
