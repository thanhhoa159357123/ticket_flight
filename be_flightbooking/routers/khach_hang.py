from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from utils.spark import get_spark  # giống auth.py
from pymongo import MongoClient

router = APIRouter()
client = MongoClient("mongodb://localhost:27017")
khach_hang_collection = client["flightApp"]["khach_hang"]


@router.get("/khachhang", tags=["khach_hang"])
def get_all_khach_hang():
    try:
        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource") \
            .option("uri", "mongodb://localhost:27017/flightApp.khach_hang") \
            .load()
        print("✅ Đã đọc dữ liệu khách hàng từ MongoDB bằng Spark")
        df.printSchema()
        df = df.select("ma_khach_hang", "ten_khach_hang", "so_dien_thoai", "email", "matkhau")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_khach_hang:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/khachhang/{ma_khach_hang}", tags=["khach_hang"])
def get_khach_hang(ma_khach_hang: str):
    try:
        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource") \
            .option("uri", "mongodb://localhost:27017/flightApp.khach_hang") \
            .load()

        print(f"🔍 Tìm kiếm khách hàng với mã: {ma_khach_hang}")
        filtered = df.filter(df["ma_khach_hang"] == ma_khach_hang)

        if filtered.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")

        row = filtered.first()
        result = {
            "ma_khach_hang": row["ma_khach_hang"],
            "ten_khach_hang": row["ten_khach_hang"],
            "so_dien_thoai": row["so_dien_thoai"],
            "email": row["email"],
            "matkhau": row["matkhau"]
        }

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_khach_hang:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
