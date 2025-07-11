from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    auth, khach_hang, hang_bay, hang_ban_ve, san_bay,
    tuyen_bay, chuyen_bay, hang_ve, loai_chuyen_di, gia_ve
)
from utils.spark import init_spark, load_df

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

    yield  # App tiếp tục chạy

app = FastAPI(lifespan=lifespan)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
