from fastapi import APIRouter, HTTPException
from utils.spark import load_df
from app.models.hoa_don import HoaDonBase
from pyspark.sql.functions import col
from pymongo import MongoClient
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB

import os


router = APIRouter()

@router.get("/dat_ve/total")
def get_total_bookings():
    try:
        df = load_df("dat_ve")

        # Loại bỏ vé bị hủy
        df = df.filter((df["trang_thai"].isNull()) | (df["trang_thai"] != "Đã hủy"))

        total = df.count()
        return {"total_bookings": total}
    except Exception as e:
        print("Lỗi khi đếm số lượng vé đã đặt:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

client = MongoClient(DATA_MONGO_URI)
db = client[DATA_MONGO_DB]
hoa_don_collection = db["hoa_don"]

@router.get("/hoa_don", response_model=list[HoaDonBase])
def get_hoa_don():
    try:
        hoa_don_list = list(hoa_don_collection.find({}, {"_id": 0}))
        return hoa_don_list
    except Exception as e:
        print("Lỗi khi lấy danh sách hóa đơn:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    

@router.get("/hoa_don/total_revenue")
def get_total_revenue():
    try:
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$tong_tien"}}}
        ]
        result = list(hoa_don_collection.aggregate(pipeline))
        total = result[0]["total"] if result else 0
        return {"total_revenue": total}
    except Exception as e:
        print("Lỗi khi tính tổng doanh thu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")