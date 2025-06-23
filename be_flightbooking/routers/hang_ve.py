from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_ve import HangVe
from utils.spark import get_spark
from pymongo import MongoClient

router = APIRouter()
client = MongoClient("mongodb://localhost:27017/")
hang_ve_collection = client["flightApp"]["hang_ve"]


@router.post("/add", tags=["hang_ve"])
def add_hang_ve(hang_ve: HangVe):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_ve.dict())

        spark = get_spark()
        df = (
            spark.read.format("com.mongodb.spark.sql.DefaultSource")
            .option("uri", "mongodb://localhost:27017/flightApp.hang_ve")
            .load()
        )

        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        if (
            "ma_hang_ve" in df.columns
            and df.filter(df["ma_hang_ve"] == hang_ve.ma_hang_ve).count() > 0
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Hạng vé với mã {hang_ve.ma_hang_ve} đã tồn tại",
            )
        
        data_to_insert = hang_ve.dict()
        insert_result = hang_ve_collection.insert_one(data_to_insert)

        print("✅ Dữ liệu đã được thêm vào MongoDB:", hang_ve.ma_hang_ve)

        data_to_insert["_id"] = str(insert_result.inserted_id)

        return JSONResponse(
            content={
                "message": "Hạng vé đã được thêm thành công",
                "data": data_to_insert
            }
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    
@router.get("/get", tags=["hang_ve"])
def get_all_hang_ve():
    try:
        spark = get_spark()
        df = (
            spark.read.format("com.mongodb.spark.sql.DefaultSource")
            .option("uri", "mongodb://localhost:27017/flightApp.hang_ve")
            .load()
        )

        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        df = df.select(
            "ma_hang_ve", "vi_tri_ngoi", "so_luong_hanh_ly", "refundable", "changeable"
        )
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(
            content=result
        )
    
    except Exception as e:
        print("❌ Lỗi trong /get:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

