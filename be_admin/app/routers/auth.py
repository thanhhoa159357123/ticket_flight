from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from jose import jwt
import os
from datetime import datetime, timedelta
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
admin_collection = client[MONGO_DB]["User"]

# Không có Secrect Key trong đoạn mã gốc

router = APIRouter()

@router.post("/login", tags=["auth"])
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = admin_collection.find_one({"username": form_data.username})
        if not user or form_data.password != user["password"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        # Tạo token
        token_data = {
            "sub": user["username"],
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(token_data, os.getenv("SECRET_KEY"), algorithm="HS256")

        return {"access_token": token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# tạm thời không có endpoint đăng ký người dùng mới

# Tạm thời không có endpoint để update thông tin người dùng
