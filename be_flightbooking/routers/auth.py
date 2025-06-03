from fastapi import APIRouter, HTTPException, Query, Body
from models.khach_hang import KhachHang, KhachHangCreate
from utils.spark import get_spark
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
khach_hang_collection = client["flightApp"]["khach_hang"]

router = APIRouter()


def generate_next_ma_khach_hang():
    last = khach_hang_collection.find().sort("ma_khach_hang", -1).limit(1)
    last_code = next(last, {}).get("ma_khach_hang", "KH000")
    next_number = int(last_code[2:]) + 1
    return f"KH{next_number:03}"


@router.post("/register", tags=["auth"])
def register_user(khach_hang: KhachHangCreate):
    try:
        print("📥 Dữ liệu nhận từ client:", khach_hang.dict())

        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
            .option("uri", "mongodb://localhost:27017/flightApp.khach_hang")\
            .load()
        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        if "email" in df.columns and df.filter(df["email"] == khach_hang.email).count() > 0:
            raise HTTPException(status_code=400, detail="Email đã tồn tại")

        ma_khach_hang = generate_next_ma_khach_hang()
        data_to_insert = khach_hang.dict()
        data_to_insert["ma_khach_hang"] = ma_khach_hang

        khach_hang_collection.insert_one(data_to_insert)
        print("🎉 Thêm khách hàng thành công:", khach_hang.email)

        return {"message": "Đăng ký thành công", "ma_khach_hang": ma_khach_hang}

    except Exception as e:
        print("❌ Lỗi trong /register:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("/login", tags=["auth"])
def login_user(email: str = Query(...), matkhau: str = Query(...)):
    try:
        spark = get_spark()
        df = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
            .option("uri", "mongodb://localhost:27017/flightApp.khach_hang")\
            .load()

        matched = df.filter((df.email == email) & (df.matkhau == matkhau))
        if matched.count() == 0:
            raise HTTPException(status_code=401, detail="Sai thông tin đăng nhập")

        row = matched.first()
        return {
            "message": "Đăng nhập thành công",
            "ma_khach_hang": row["ma_khach_hang"],
            "ten_khach_hang": row["ten_khach_hang"],
            "email": row["email"],
            "so_dien_thoai": row["so_dien_thoai"],
            "matkhau": row["matkhau"],
        }

    except Exception as e:
        print("❌ Lỗi trong /login:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("/update-info", tags=["auth"])
def update_user_info(
    current_email: str = Query(..., description="Email hiện tại"),
    ten_khach_hang: str = Body(None),
    so_dien_thoai: str = Body(None),
    matkhau: str = Body(None),
    email: str = Body(None),
):
    try:
        update_fields = {}
        if ten_khach_hang:
            update_fields["ten_khach_hang"] = ten_khach_hang
        if so_dien_thoai:
            update_fields["so_dien_thoai"] = so_dien_thoai
        if matkhau:
            update_fields["matkhau"] = matkhau
        if email:
            spark = get_spark()
            df_check = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
                .option("uri", "mongodb://localhost:27017/flightApp.khach_hang")\
                .load()
            if df_check.filter((df_check.email == email) & (df_check.email != current_email)).count() > 0:
                raise HTTPException(status_code=400, detail="Email mới đã tồn tại")
            update_fields["email"] = email

        if not update_fields:
            raise HTTPException(status_code=400, detail="Không có thông tin nào để cập nhật")

        result = khach_hang_collection.update_one(
            {"email": current_email},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng với email đã cho")

        spark = get_spark()
        df_updated = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
            .option("uri", "mongodb://localhost:27017/flightApp.khach_hang")\
            .load()
        final_email = email if email else current_email
        user_row = df_updated.filter(df_updated.email == final_email).first()

        return {
            "message": "Cập nhật thành công",
            "user": {
                "ma_khach_hang": user_row["ma_khach_hang"],
                "ten_khach_hang": user_row["ten_khach_hang"],
                "email": user_row["email"],
                "so_dien_thoai": user_row["so_dien_thoai"],
            }
        }

    except Exception as e:
        print("❌ Lỗi trong /update-info:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
