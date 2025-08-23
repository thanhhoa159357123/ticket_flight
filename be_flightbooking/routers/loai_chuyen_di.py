from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.loaichuyendi import LoaiChuyenDi
from pymongo import MongoClient
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_URI, MONGO_DB
import traceback

router = APIRouter()
client = MongoClient(MONGO_URI)
loaichuyendi_collection = client[MONGO_DB]["loaichuyendi"]


@router.get("", tags=["loaichuyendi"])
def get_all_loaichuyendi():
    try:
        df = load_df("loaichuyendi").select("ma_chuyen_di", "ten_chuyen_di", "mo_ta")
        result = df.toPandas().to_dict(orient="records")

        print(f"✅ [loaichuyendi] Tải {len(result)} bản ghi thành công từ cache")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_loaichuyendi:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("", tags=["loaichuyendi"])
def add_loaichuyendi(loaichuyendi: LoaiChuyenDi):
    try:
        payload = loaichuyendi.dict()
        ma_chuyen_di = payload.get("ma_chuyen_di")
        if not ma_chuyen_di:
            raise HTTPException(status_code=400, detail="Thiếu mã loại chuyến đi")

        print(f"📥 Nhận dữ liệu thêm mới: {payload}")

        # 🔍 Check tồn tại trong Spark cache
        df = load_df("loaichuyendi")
        df_filtered = df.filter(df["ma_chuyen_di"] == ma_chuyen_di)

        if df_filtered.count() > 0:
            print(f"⚠️ Mã {ma_chuyen_di} đã tồn tại trong cache")
            raise HTTPException(status_code=400, detail="Mã loại chuyến đi đã tồn tại")

        # ✅ Ghi vào MongoDB
        inserted = loaichuyendi_collection.insert_one(payload)
        payload["_id"] = str(inserted.inserted_id)

        # 🔄 Invalidate Spark cache
        invalidate_cache("loaichuyendi")
        print(f"✅ Đã thêm loại chuyến đi mới: {ma_chuyen_di}")

        return JSONResponse(
            content={"message": "Thêm loại chuyến đi thành công", "data": payload},
            status_code=201,
        )

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Lỗi trong add_loaichuyendi:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
