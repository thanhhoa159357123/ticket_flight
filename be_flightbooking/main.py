# main.py
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    auth,
    khach_hang,
    hang_bay,
    hang_ban_ve,
    san_bay,
    tuyen_bay,
    chuyen_bay,
    hang_ve,
    loai_chuyen_di,
    gia_ve,
    dat_ve,
    hanh_khach,
    chi_tiet_ve_dat,
    hoa_don,
    notifications
)
from utils.spark import init_spark, load_df
from utils.spark_views import init_spark_views


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_spark()

    # ⏬ Preload Spark DataFrame quan trọng (tăng tốc login)
    print("🚀 Preloading Spark cache...")
    load_df("khach_hang")
    load_df("chuyen_bay")
    load_df("san_bay")
    load_df("hang_bay")
    load_df("hang_ban_ve")
    load_df("loai_chuyen_di")
    load_df("tuyen_bay")
    load_df("hang_ve")
    load_df("gia_ve")
    print("✅ Preload hoàn tất!")
    
    init_spark_views()  # 🔥 Tạo view cho Spark SQL
    print("✅ Đã khởi tạo các view SQL cho Spark!")
    yield  # App tiếp tục chạy


app = FastAPI(lifespan=lifespan)


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


# ✅ Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(auth.router, prefix="/auth")
app.include_router(khach_hang.router, prefix="/api/khach-hang")
app.include_router(hang_bay.router, prefix="/api/hang-bay")
app.include_router(hang_ban_ve.router, prefix="/api/hang-ban-ve")
app.include_router(san_bay.router, prefix="/api/san-bay")
app.include_router(tuyen_bay.router, prefix="/api/tuyen-bay")
app.include_router(chuyen_bay.router, prefix="/api/chuyen-bay")
app.include_router(hang_ve.router, prefix="/api/hang-ve")
app.include_router(loai_chuyen_di.router, prefix="/api/loai-chuyen-di")
app.include_router(gia_ve.router, prefix="/api/gia-ve")
app.include_router(dat_ve.router, prefix="/api/dat-ve")
app.include_router(hanh_khach.router, prefix="/api/hanh-khach")
app.include_router(chi_tiet_ve_dat.router, prefix="/api/chi-tiet-ve-dat")
app.include_router(hoa_don.router, prefix="/api/hoa-don")
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
