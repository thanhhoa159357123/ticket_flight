from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, khach_hang, hang_bay, hang_ban_ve, san_bay, tuyen_bay, chuyen_bay, hang_ve
from utils.spark import init_spark
import os

print("🔍 ENV URI:", os.getenv("MONGO_URI"))
app = FastAPI()

init_spark()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(khach_hang.router, prefix="/api")
app.include_router(hang_bay.router, prefix="/api-hang-bay")
app.include_router(hang_ban_ve.router, prefix="/api-hang-ban-ve")
app.include_router(san_bay.router, prefix="/api-san-bay")
app.include_router(tuyen_bay.router, prefix="/api-tuyen-bay")
app.include_router(chuyen_bay.router, prefix="/api-chuyen-bay")
app.include_router(hang_ve.router, prefix="/api-hang-ve")

# 👉 Thêm đoạn này để có thể chạy trực tiếp:
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
