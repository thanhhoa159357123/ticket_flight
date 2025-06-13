from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_ban_ve import HangBanVe
from utils.spark import get_spark
from pymongo import MongoClient
import json

router = APIRouter()
client = MongoClient("mongodb://localhost:27017")
hang_ban_ve_collection = client["flightApp"]["hang_ban_ve"]


@router.post("/add", tags=["hang_ban_ve"])
def add_hang_ban_ve(hang_ban_ve: HangBanVe):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_ban_ve.dict())

        spark = get_spark()
        df = (
            spark.read.format("com.mongodb.spark.sql.DefaultSource")
            .option("uri", "mongodb://localhost:27017/flightApp.hang_ban_ve")
            .load()
        )
        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        if (
            "ma_hang_ban_ve" in df.columns
            and df.filter(df["ma_hang_ban_ve"] == hang_ban_ve.ma_hang_ban_ve).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bay đã tồn tại")

        data_to_insert = hang_ban_ve.dict()
        inserted = hang_ban_ve_collection.insert_one(data_to_insert)

        print("🎉 Thêm hãng bay thành công:", hang_ban_ve.ma_hang_ban_ve)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm hãng bán vé thành công", "hang_ban_ve": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/get", tags=["hang_ban_ve"])
def get_all_hang_ban_ve():
    try:
        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource") \
            .option("uri", "mongodb://localhost:27017/flightApp.hang_ban_ve") \
            .load()
        
        print("✅ Đã đọc dữ liệu hãng bay từ MongoDB bằng Spark")
        df.printSchema()

        # Các cột mong muốn
        df = df.select("ma_hang_ban_ve", "ten_hang_ban_ve", "vai_tro")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_hang_ban_ve:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    
@router.delete("/delete/{ma_hang_ban_ve}", tags=["hang_ban_ve"])
def delete_hang_ban_ve(ma_hang_ban_ve: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_hang_ban_ve}")

        result = hang_ban_ve_collection.delete_one({"ma_hang_ban_ve": ma_hang_ban_ve})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay cần xoá")

        return JSONResponse(content={"message": f"Đã xoá tuyến bay {ma_hang_ban_ve} thành công"})

    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
