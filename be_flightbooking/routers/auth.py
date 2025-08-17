from fastapi import APIRouter, HTTPException, Query, Body
from models.khachhang import KhachHangCreate
from utils.spark import load_df, refresh_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import datetime, timezone
import json
import traceback
import re
from pymongo.errors import DuplicateKeyError

client = MongoClient(MONGO_URI) 
khach_hang_collection = client[MONGO_DB]["khachhang"]

router = APIRouter()

def load_khach_hang_collection(df = "khachhang"):
    """Load the khach_hang collection with optimized query"""
    try:
        df = load_df("khachhang")
        if not df.is_cached:
            df = df.cache()
        return df
    except Exception as e:
        print(f"❌ Lỗi khi tải khach_hang collection: {e}")
        raise HTTPException(status_code=500, detail="Lỗi tải dữ liệu khách hàng")

def generate_next_ma_khach_hang():
    """Generate unique customer code with better performance"""
    try:
        # Tối ưu MongoDB query với projection và regex
        last = khach_hang_collection.find(
            {"ma_khach_hang": {"$regex": "^KH\\d{3}$"}}, 
            {"ma_khach_hang": 1}
        ).sort("ma_khach_hang", -1).limit(1)
        
        last_doc = next(last, None)
        if last_doc:
            last_code = last_doc.get("ma_khach_hang", "KH000")
            next_number = int(last_code[2:]) + 1
        else:
            next_number = 1
            
        return f"KH{next_number:03d}"
    except Exception as e:
        print(f"❌ Lỗi tạo mã khách hàng: {e}")
        # Fallback: use timestamp-based code
        import time
        return f"KH{int(time.time()) % 1000:03d}"

@router.post("/register", tags=["auth"])
def register_user(khachhang: KhachHangCreate):
    try:
        print("📥 Dữ liệu nhận từ client:", json.dumps(khachhang.dict(), ensure_ascii=False))

        # Normalize email để tránh duplicate case-sensitive
        normalized_email = khachhang.email.lower().strip()

        # Tối ưu Spark query - cache DataFrame và sử dụng limit
        df = load_khach_hang_collection("khachhang")
    
        # # Tối ưu filter: kết hợp điều kiện và sử dụng limit(1) cho performance
        # matched_df = df.filter(
        #     (df["email"] == normalized_email) & 
        #     ((df["deleted_at"] == "") | (df["deleted_at"].isNull()))
        # ).limit(1)

        # # Sử dụng count() với limit để stop ngay khi tìm thấy
        # if matched_df.count() > 0:
        #     raise HTTPException(status_code=400, detail="Email đã tồn tại")

        # Generate mã khách hàng
        ma_khach_hang = generate_next_ma_khach_hang()
        now_str = datetime.now(timezone.utc).isoformat()

        # Chuẩn bị data với normalized email
        data_to_insert = khachhang.dict()
        data_to_insert.update({
            "ma_khach_hang": ma_khach_hang,
            "email": normalized_email,  # Use normalized email
            "is_active": True,
            "da_dat_ve": False,
            "deleted_at": "",
            "last_active_at": now_str,
            "created_at": now_str
        })

        # Insert với duplicate key handling
        try:
            result = khach_hang_collection.insert_one(data_to_insert)
            if not result.inserted_id:
                raise HTTPException(status_code=500, detail="Không thể tạo tài khoản")
        except DuplicateKeyError:
            # Handle race condition nếu có 2 request cùng lúc
            raise HTTPException(status_code=400, detail="Email đã tồn tại")

        # Invalidate cache sau khi insert thành công
        refresh_cache("khachhang")

        print(f"🎉 Đăng ký thành công: {normalized_email} - Mã KH: {ma_khach_hang}")
        
        return {
            "message": "Đăng ký thành công", 
            "ma_khach_hang": ma_khach_hang,
            "email": normalized_email
        }

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"❌ Lỗi trong /register: {repr(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.post("/login", tags=["auth"])
def login_user(email: str = Query(...), matkhau: str = Query(...)):
    try:
        df = load_khach_hang_collection("khachhang")
        result_df = df.filter(
            (df["email"] == email) &
            (df["matkhau"] == matkhau) &
            (df["is_active"] == True) &
            (df["deleted_at"] == "")
        )

        if result_df.count() == 0:
            raise HTTPException(status_code=401, detail="Sai thông tin đăng nhập")

        row = result_df.first()
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

@router.patch("/update-info", tags=["auth"])
def update_user_info(
    current_email: str = Query(...),
    ten_khach_hang: str = Body(None),
    so_dien_thoai: str = Body(None),
    matkhau: str = Body(None),
    email: str = Body(None),
):
    try:
        df_check = load_khach_hang_collection("khachhang")

        update_fields = {}
        if ten_khach_hang:
            update_fields["ten_khach_hang"] = ten_khach_hang
        if so_dien_thoai:
            update_fields["so_dien_thoai"] = so_dien_thoai
        if matkhau:
            update_fields["matkhau"] = matkhau
        if email:
            email_conflict_df = df_check.filter(
                (df_check["email"] == email) & (df_check["email"] != current_email)
            )
            if email_conflict_df.count() > 0:
                raise HTTPException(status_code=400, detail="Email mới đã tồn tại")
            update_fields["email"] = email

        update_fields["last_active_at"] = datetime.now(timezone.utc).isoformat()

        result = khach_hang_collection.update_one({"email": current_email}, {"$set": update_fields})

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

        df_updated = refresh_cache("khachhang")
        final_email = email if email else current_email
        user_row = df_updated.filter(df_updated["email"] == final_email).first()

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
