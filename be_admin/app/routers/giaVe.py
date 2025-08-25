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
ve_collection = client[DATA_MONGO_DB]["ve"]

@router.get("", tags=["ve"])
def get_all_ve():
    try:
        df = load_df("ve")
        df = df.select("ma_ve", "gia_ve", "ma_hang_ve", "ma_chuyen_bay", "ma_hang_ban_ve")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi tải danh sách vé")

@router.post("", tags=["ve"])
def add_ve(gia_ve: GiaVe):
    try:
        print("📥 Nhận dữ liệu vé:", gia_ve.dict())

        df = load_df("ve")
        if "ma_ve" in df.columns and df.filter(df["ma_ve"] == gia_ve.ma_ve).count() > 0:
            raise HTTPException(status_code=400, detail="Mã vé đã tồn tại")

        data_to_insert = gia_ve.dict()
        inserted = ve_collection.insert_one(data_to_insert)

        invalidate_cache("ve")
        print("✅ Thêm vé thành công:", gia_ve.ma_ve)

        data_to_insert["_id"] = str(inserted.inserted_id)
        return JSONResponse(content={"message": "Thêm vé thành công", "ve": data_to_insert})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi thêm vé")

@router.put("/{ma_ve}", tags=["ve"])
def update_ve(ma_ve: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Cập nhật vé {ma_ve} với:", updated_data)

        existing = ve_collection.find_one({"ma_ve": ma_ve})
        if not existing:
            raise HTTPException(status_code=404, detail="Vé không tồn tại")

        if "ma_ve" in updated_data:
            updated_data.pop("ma_ve")

        result = ve_collection.update_one({"ma_ve": ma_ve}, {"$set": updated_data})
        invalidate_cache("ve")

        if result.modified_count == 0:
            return JSONResponse(content={"message": "Không có thay đổi nào"}, status_code=200)

        return JSONResponse(content={"message": f"Cập nhật vé {ma_ve} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi cập nhật vé")

@router.delete("/{ma_ve}", tags=["ve"])
def delete_ve(ma_ve: str):
    try:
        print(f"🗑 Xoá vé: {ma_ve}")

        result = ve_collection.delete_one({"ma_ve": ma_ve})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy vé để xoá")

        invalidate_cache("gia_ve")
        return JSONResponse(content={"message": f"Đã xoá vé {ma_ve} thành công"})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server khi xoá vé")
