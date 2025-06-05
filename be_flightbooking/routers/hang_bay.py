from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_bay import HangBay
from utils.spark import get_spark
from pymongo import MongoClient
import json

router = APIRouter()
client = MongoClient("mongodb://localhost:27017")
hang_bay_collection = client["flightApp"]["hang_bay"]


@router.post("/add", tags=["hang_bay"])
def add_hang_bay(hang_bay: HangBay):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_bay.dict())

        spark = get_spark()
        df = (
            spark.read.format("com.mongodb.spark.sql.DefaultSource")
            .option("uri", "mongodb://localhost:27017/flightApp.hang_bay")
            .load()
        )
        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        if (
            "ma_hang_bay" in df.columns
            and df.filter(df["ma_hang_bay"] == hang_bay.ma_hang_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bay đã tồn tại")

        data_to_insert = hang_bay.dict()
        inserted = hang_bay_collection.insert_one(data_to_insert)

        print("🎉 Thêm hãng bay thành công:", hang_bay.ma_hang_bay)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm hãng bay thành công", "hang_bay": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/get", tags=["hang_bay"])
def get_all_hang_bay():
    try:
        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource") \
            .option("uri", "mongodb://localhost:27017/flightApp.hang_bay") \
            .load()
        
        print("✅ Đã đọc dữ liệu hãng bay từ MongoDB bằng Spark")
        df.printSchema()

        # Các cột mong muốn
        df = df.select("ma_hang_bay", "ten_hang_bay", "iata_code", "quoc_gia")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_hang_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
