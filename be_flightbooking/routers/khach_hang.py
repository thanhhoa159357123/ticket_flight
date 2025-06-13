from fastapi import APIRouter, HTTPException, Body, Path
from fastapi.responses import JSONResponse
from utils.spark import get_spark
from pymongo import MongoClient
from utils.logger import logger
from datetime import datetime, timezone


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

        df = df.filter("deleted_at == '' AND is_active == true") \
               .select("ma_khach_hang", "ten_khach_hang", "so_dien_thoai", "email", "is_active", "da_dat_ve")
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
        filtered = df.filter((df["ma_khach_hang"] == ma_khach_hang) & (df["deleted_at"] == ""))

        if filtered.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")

        row = filtered.first()
        result = {
            "ma_khach_hang": row["ma_khach_hang"],
            "ten_khach_hang": row["ten_khach_hang"],
            "so_dien_thoai": row["so_dien_thoai"],
            "email": row["email"],
            "is_active": row["is_active"],
            "da_dat_ve": row["da_dat_ve"],
            "last_active_at": row["last_active_at"]
        }

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_khach_hang:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.patch("/khachhang/update/{ma_khach_hang}", tags=["khach_hang"])
def update_khach_hang_admin(
    ma_khach_hang: str = Path(...),
    ten_khach_hang: str = Body(None),
    so_dien_thoai: str = Body(None),
    email: str = Body(None),
    matkhau: str = Body(None),
    is_active: bool = Body(None)
):
    try:
        update_fields = {}

        if ten_khach_hang:
            update_fields["ten_khach_hang"] = ten_khach_hang
        if so_dien_thoai:
            update_fields["so_dien_thoai"] = so_dien_thoai
        if email:
            update_fields["email"] = email
        if matkhau:
            update_fields["matkhau"] = matkhau
        if is_active is not None:
            update_fields["is_active"] = is_active

        if not update_fields:
            raise HTTPException(status_code=400, detail="Không có trường hợp nào hợp lệ để cập nhật")

        update_fields["last_active_at"] = datetime.now(timezone.utc).isoformat()

        result = khach_hang_collection.update_one(
            {"ma_khach_hang": ma_khach_hang, "deleted_at": ""},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")

        # ✅ GHI LOG
        logger.info(f"[ADMIN UPDATE] Mã KH: {ma_khach_hang} | Thay đổi: {update_fields}")

        updated_doc = khach_hang_collection.find_one({"ma_khach_hang": ma_khach_hang})
        updated_doc.pop("_id", None)

        return JSONResponse(content={
            "message": "Cập nhật thành công",
            "khach_hang": updated_doc
        })

    except Exception as e:
        print("❌ Lỗi:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")