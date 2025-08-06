# routers/ve_router.py

from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.gia_ve import GiaVe
from utils.spark import load_df, invalidate_cache
from utils.env_loader import DATA_MONGO_DB, DATA_MONGO_URI
from pymongo import MongoClient
import traceback

router = APIRouter()

# MongoDB connection
client = MongoClient(DATA_MONGO_URI)
ve_collection = client[DATA_MONGO_DB]["gia_ve"]

@router.get("", tags=["gia_ve"])
def get_all_ve():
    try:
        df = load_df("gia_ve")
        df = df.select("ma_gia_ve", "gia", "ma_hang_ve", "ma_chuyen_bay", "ma_hang_ban_ve", "goi_ve")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi tải danh sách vé")

@router.post("", tags=["gia_ve"])
def add_ve(gia_ve: GiaVe):
    try:
        print("📥 Nhận dữ liệu vé:", gia_ve.dict())

        df = load_df("gia_ve")
        if "ma_gia_ve" in df.columns and df.filter(df["ma_gia_ve"] == gia_ve.ma_gia_ve).count() > 0:
            raise HTTPException(status_code=400, detail="Mã giá vé đã tồn tại")

        data_to_insert = gia_ve.dict()
        inserted = ve_collection.insert_one(data_to_insert)

        invalidate_cache("gia_ve")
        print("✅ Thêm vé thành công:", gia_ve.ma_gia_ve)

        data_to_insert["_id"] = str(inserted.inserted_id)
        return JSONResponse(content={"message": "Thêm vé thành công", "ve": data_to_insert})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi thêm vé")

@router.put("/{ma_gia_ve}", tags=["gia_ve"])
def update_ve(ma_gia_ve: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Cập nhật vé {ma_gia_ve} với:", updated_data)

        existing = ve_collection.find_one({"ma_gia_ve": ma_gia_ve})
        if not existing:
            raise HTTPException(status_code=404, detail="Vé không tồn tại")

        if "ma_gia_ve" in updated_data:
            updated_data.pop("ma_gia_ve")

        result = ve_collection.update_one({"ma_gia_ve": ma_gia_ve}, {"$set": updated_data})
        invalidate_cache("gia_ve")

        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào"}, status_code=200)

        return JSONResponse(content={"message": f"Cập nhật vé {ma_gia_ve} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi cập nhật vé")

@router.delete("/{ma_gia_ve}", tags=["gia_ve"])
def delete_ve(ma_gia_ve: str):
    try:
        print(f"🗑 Xoá vé: {ma_gia_ve}")

        result = ve_collection.delete_one({"ma_gia_ve": ma_gia_ve})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy vé để xoá")

        invalidate_cache("gia_ve")
        return JSONResponse(content={"message": f"Đã xoá vé {ma_gia_ve} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi xoá vé")
