from fastapi import APIRouter, HTTPException
from utils.spark import load_df
from app.models.hoa_don import HoaDonBase
from pyspark.sql.functions import col
from pymongo import MongoClient
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB

client = MongoClient(DATA_MONGO_URI)
db = client[DATA_MONGO_DB]
hoa_don_collection = db["hoa_don"]

router = APIRouter()


@router.get("/hoa_don", response_model=list[HoaDonBase])
def get_hoa_don():
    try:
        hoa_don_list = list(hoa_don_collection.find({}, {"_id": 0}))
        return hoa_don_list
    except Exception as e:
        print("Lỗi khi lấy danh sách hóa đơn:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    