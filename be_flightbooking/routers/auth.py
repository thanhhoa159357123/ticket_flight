from fastapi import APIRouter, HTTPException, Query, Body
from models.khach_hang import KhachHangCreate
from utils.spark import get_spark
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import datetime, timezone
import os
import json
import traceback

client = MongoClient(MONGO_URI)
khach_hang_collection = client[MONGO_DB]["khach_hang"]

router = APIRouter()

def generate_next_ma_khach_hang():
    last = khach_hang_collection.find().sort("ma_khach_hang", -1).limit(1)
    last_code = next(last, {}).get("ma_khach_hang", "KH000")
    next_number = int(last_code[2:]) + 1
    return f"KH{next_number:03}"

def load_khach_hang_df():
    spark = get_spark()
    return (
        spark.read.format("com.mongodb.spark.sql.DefaultSource")
        .option("uri", os.getenv("MONGO_URI"))
        .option("database", MONGO_DB)
        .option("collection", "khach_hang")
        .load()
    )

@router.post("/register", tags=["auth"])
def register_user(khach_hang: KhachHangCreate):
    try:
        print("📥 Dữ liệu nhận từ client:", json.dumps(khach_hang.dict(), ensure_ascii=False))

        df = load_khach_hang_df()

        if "email" in df.columns and df.filter(df["email"] == khach_hang.email).count() > 0:
            raise HTTPException(status_code=400, detail="Email đã tồn tại")

        ma_khach_hang = generate_next_ma_khach_hang()
        now_str = datetime.now(timezone.utc).isoformat()

        data_to_insert = khach_hang.dict()
        data_to_insert.update({
            "ma_khach_hang": ma_khach_hang,
            "is_active": True,
            "da_dat_ve": False,
            "deleted_at": "",
            "last_active_at": now_str,
            "created_at": now_str
        })

        khach_hang_collection.insert_one(data_to_insert)
        print("🎉 Đăng ký thành công:", khach_hang.email)

        return {"message": "Đăng ký thành công", "ma_khach_hang": ma_khach_hang}

    except Exception as e:
        print("❌ Lỗi trong /register:", repr(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.post("/login", tags=["auth"])
def login_user(email: str = Query(...), matkhau: str = Query(...)):
    try:
        df = load_khach_hang_df()

        matched = df.filter(
            (df.email == email)
            & (df.matkhau == matkhau)
            & (df.is_active == True)
            & (df.deleted_at == "")
        )

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
        print("❌ Lỗi trong /login:", repr(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.post("/update-info", tags=["auth"])
def update_user_info(
    current_email: str = Query(...),
    ten_khach_hang: str = Body(None),
    so_dien_thoai: str = Body(None),
    matkhau: str = Body(None),
    email: str = Body(None),
):
    try:
        df_check = load_khach_hang_df()

        update_fields = {}
        if ten_khach_hang:
            update_fields["ten_khach_hang"] = ten_khach_hang
        if so_dien_thoai:
            update_fields["so_dien_thoai"] = so_dien_thoai
        if matkhau:
            update_fields["matkhau"] = matkhau
        if email:
            if (
                df_check.filter((df_check.email == email) & (df_check.email != current_email)).count()
                > 0
            ):
                raise HTTPException(status_code=400, detail="Email mới đã tồn tại")
            update_fields["email"] = email

        if not update_fields:
            raise HTTPException(status_code=400, detail="Không có thông tin nào để cập nhật")

        update_fields["last_active_at"] = datetime.now(timezone.utc).isoformat()

        result = khach_hang_collection.update_one({"email": current_email}, {"$set": update_fields})

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

        df_updated = load_khach_hang_df()
        final_email = email if email else current_email
        user_row = df_updated.filter(df_updated.email == final_email).first()

        return {
            "message": "Cập nhật thành công",
            "user": {
                "ma_khach_hang": user_row["ma_khach_hang"],
                "ten_khach_hang": user_row["ten_khach_hang"],
                "email": user_row["email"],
                "so_dien_thoai": user_row["so_dien_thoai"],
            },
        }

    except Exception as e:
        print("❌ Lỗi trong /update-info:", repr(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
