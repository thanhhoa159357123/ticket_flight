from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, khach_hang, hang_bay
from utils.spark import init_spark

app = FastAPI()

# Khởi tạo SparkSession một lần duy nhất
init_spark()

# Cho phép frontend truy cập API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Đổi nếu React dùng cổng khác
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(auth.router, prefix="/auth")
app.include_router(khach_hang.router, prefix="/api")
app.include_router(hang_bay.router, prefix="/api-hang-bay")

