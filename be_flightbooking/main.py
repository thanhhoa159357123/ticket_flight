# be_flightbooking/main.py
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    auth, khach_hang, hang_bay, hang_ban_ve, san_bay,
    chuyen_bay, hang_ve, loai_chuyen_di, ve,
    dat_ve, hanh_khach, chi_tiet_ve_dat,
    hoa_don, notifications, vedientu
)
from utils.spark import init_spark, preload_collections
from utils.spark_views import init_spark_views


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_spark()
    print("🚀 Preloading Spark cache song song...")
    preload_collections()
    print("✅ Preload hoàn tất!")

    init_spark_views()
    print("✅ Đã khởi tạo các view SQL cho Spark!")
    yield


app = FastAPI(
    lifespan=lifespan,
    title="Flight Booking API",
    description="High-Performance Flight Booking System",
    version="2.0.0",
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("❌ Lỗi validate:")
    for error in exc.errors():
        print(error)
    print("📦 Payload lỗi:")
    try:
        print(await request.json())
    except:
        print("Không đọc được payload JSON")

    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"detail": exc.errors()}),
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers_config = [
    (auth.router, "/auth"),
    (khach_hang.router, "/khachhang"),
    (hang_bay.router, "/hangbay"),
    (hang_ban_ve.router, "/hangbanve"),
    (san_bay.router, "/sanbay"),
    (chuyen_bay.router, "/chuyenbay"),
    (hang_ve.router, "/hangve"),
    (loai_chuyen_di.router, "/loaichuyendi"),
    (ve.router, "/ve"),
    (dat_ve.router, "/datve"),
    (hanh_khach.router, "/hanhkhach"),
    (chi_tiet_ve_dat.router, "/chitietdatve"),
    (hoa_don.router, "/hoadon"),
    (notifications.router, "/notifications"),
    (vedientu.router, "/vedientu"),
]

for router, prefix in routers_config:
    app.include_router(router, prefix=prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=["routers", "models", "utils"],
        access_log=False,
        workers=1,
    )
