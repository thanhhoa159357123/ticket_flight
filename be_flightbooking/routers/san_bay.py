from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.san_bay import SanBay
from utils.spark import get_spark
from pymongo import MongoClient
import json

router = APIRouter()
client = MongoClient("mongodb://localhost:27017")
san_bay_collection = client["flightApp"]["san_bay"]


@router.post("/add", tags=["san_bay"])
def add_san_bay(san_bay: SanBay):
    try:
        print("📥 Dữ liệu nhận từ client:", san_bay.dict())

        spark = get_spark()
        df = (
            spark.read.format("com.mongodb.spark.sql.DefaultSource")
            .option("uri", "mongodb://localhost:27017/flightApp.san_bay")
            .load()
        )
        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        if (
            "ma_san_bay" in df.columns
            and df.filter(df["ma_san_bay"] == san_bay.ma_san_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Sân bay đã tồn tại")

        data_to_insert = san_bay.dict()
        inserted = san_bay_collection.insert_one(data_to_insert)

        print("🎉 Thêm hãng bay thành công:", san_bay.ma_san_bay)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm sân bay thành công", "san_bay": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/get", tags=["san_bay"])
def get_all_san_bay():
    try:
        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource") \
            .option("uri", "mongodb://localhost:27017/flightApp.san_bay") \
            .load()
        
        print("✅ Đã đọc dữ liệu hãng bay từ MongoDB bằng Spark")
        df.printSchema()

        # Các cột mong muốn
        df = df.select("ma_san_bay", "ten_san_bay", "thanh_pho", "ma_quoc_gia", "iata_code")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_san_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.delete("/delete/{ma_san_bay}", tags=["san_bay"])
def delete_san_bay(ma_san_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_san_bay}")

        result = san_bay_collection.delete_one({"ma_san_bay": ma_san_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay cần xoá")

        return JSONResponse(content={"message": f"Đã xoá sân bay {ma_san_bay} thành công"})

    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")