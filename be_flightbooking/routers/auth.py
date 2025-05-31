from fastapi import APIRouter, HTTPException, Query
from models.khach_hang import KhachHangModel
from utils.spark import get_spark
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
khach_hang_collection = client["flightApp"]["khach_hang"]

router = APIRouter()

@router.post("/register", tags=["auth"])
def register_user(khach_hang: KhachHangModel):
    try:
        print("📥 Dữ liệu nhận từ client:", khach_hang.dict())

        spark = get_spark()
        print("🚀 SparkSession tạo thành công")

        df = spark.read.format("com.mongodb.spark.sql.DefaultSource").load()
        print("✅ Đã load dữ liệu từ MongoDB bằng Spark")

        if "email" in df.columns:
            if df.filter(df["email"] == khach_hang.email).count() > 0:
                print("⚠️ Email đã tồn tại:", khach_hang.email)
                raise HTTPException(status_code=400, detail="Email đã tồn tại")
        else:
            print("⚠️ Collection rỗng → chưa có cột 'email' để kiểm tra")

        khach_hang_collection.insert_one(khach_hang.dict())
        print("🎉 Thêm khách hàng thành công:", khach_hang.email)

        return {"message": "Đăng ký thành công"}

    except Exception as e:
        print("❌ Lỗi trong /register:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.post("/login", tags=["auth"])
def login_user(email: str = Query(...), matkhau: str = Query(...)):
    spark = get_spark()
    df = spark.read.format("com.mongodb.spark.sql.DefaultSource").load()

    matched = df.filter((df.email == email) & (df.matkhau == matkhau))
    if matched.count() == 0:
        raise HTTPException(status_code=401, detail="Sai thông tin đăng nhập")

    row = matched.collect()[0]
    return {
        "message": "Đăng nhập thành công",
        "ten_khach_hang": row["ten_khach_hang"],
        "email": row["email"]
    }
