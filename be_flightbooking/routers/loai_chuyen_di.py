from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.loaichuyendi import LoaiChuyenDi
from pymongo import MongoClient
from utils.spark import load_df, refresh_cache
from utils.env_loader import MONGO_URI, MONGO_DB

router = APIRouter()
client = MongoClient(MONGO_URI)
loaichuyendi_collection = client[MONGO_DB]["loaichuyendi"]


@router.get("", tags=["loaichuyendi"])
def get_all_loaichuyendi():
    try:
        df = load_df("loaichuyendi")
        df = df.select("ma_chuyen_di", "ten_chuyen_di", "mo_ta")
        result = df.toPandas().to_dict(orient="records")

        print(f"✅ Lấy danh sách loại chuyến đi thành công: {len(result)} records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_loaichuyendi:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("", tags=["loaichuyendi"])
def add_loaichuyendi(loaichuyendi: LoaiChuyenDi):
    try:
        print(f"📥 Dữ liệu nhận từ client: {loaichuyendi.dict()}")
        
        # Kiểm tra tồn tại với cached DataFrame
        df = load_df("loaichuyendi")
        if (
            "ma_chuyen_di" in df.columns
            and df.filter(df["ma_chuyen_di"] == loaichuyendi.ma_chuyen_di).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Mã loại chuyến đi đã tồn tại")

        # Insert vào MongoDB
        data_to_insert = loaichuyendi.dict()
        inserted = loaichuyendi_collection.insert_one(data_to_insert)
        data_to_insert["_id"] = str(inserted.inserted_id)

        # Refresh cache để có dữ liệu mới ngay lập tức
        refresh_cache("loaichuyendi")
        
        print(f"✅ Thêm loại chuyến đi thành công: {loaichuyendi.ma_chuyen_di}")
        return JSONResponse(
            content={
                "message": "Thêm loại chuyến đi thành công",
                "data": data_to_insert
            }, 
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Lỗi trong add_loaichuyendi:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
