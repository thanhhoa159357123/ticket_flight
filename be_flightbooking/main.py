from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from utils.spark import init_spark

app = FastAPI()

# Khởi tạo SparkSession một lần duy nhất
init_spark()

# Cho phép frontend truy cập API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Đổi nếu React dùng cổng khác
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(auth.router, prefix="/auth")
