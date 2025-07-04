from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.loai_chuyen_di import LoaiChuyenDi
from pymongo import MongoClient
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_URI

router = APIRouter()
client = MongoClient(MONGO_URI)
loai_chuyen_di_collection = client["ticket_flight_booking"]["loai_chuyen_di"]


@router.get("/get", tags=["loai_chuyen_di"])
def get_all_loai_chuyen_di():
    try:
        df = load_df("loai_chuyen_di")
        df = df.select("ma_chuyen_di", "ten_chuyen_di", "mo_ta")
        result = df.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_loai_chuyen_di:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("/add", tags=["loai_chuyen_di"])
def add_loai_chuyen_di(loai_chuyen_di: LoaiChuyenDi):
    try:
        df = load_df("loai_chuyen_di")

        if (
            "ma_chuyen_di" in df.columns
            and df.filter(df["ma_chuyen_di"] == loai_chuyen_di.ma_chuyen_di).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Mã loại chuyến đi đã tồn tại")

        data_to_insert = loai_chuyen_di.dict()
        inserted = loai_chuyen_di_collection.insert_one(data_to_insert)
        data_to_insert["_id"] = str(inserted.inserted_id)

        # 🔁 Làm mới cache Spark sau khi thêm mới
        invalidate_cache("loai_chuyen_di")

        return JSONResponse(content=data_to_insert, status_code=201)

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
