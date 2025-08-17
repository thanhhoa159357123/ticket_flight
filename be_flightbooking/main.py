# main.py
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import concurrent.futures
from routers import (
    auth, khach_hang, hang_bay, hang_ban_ve, san_bay,
    chuyen_bay, hang_ve, loai_chuyen_di, dat_ve, hanh_khach,
    chi_tiet_ve_dat, hoa_don, notifications, ve
)
from utils.spark import (
    init_spark, get_cache_status, preload_collections, clear_all_cache
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup with optimized cache preloading"""
    print("🚀 Starting Flight Booking API...")
    
    # Initialize Spark
    print("⚙️ Initializing Spark...")
    init_spark()
    
    # Define collections to preload (using actual MongoDB collection names)
    priority_collections = ["khachhang", "chuyenbay", "sanbay", "hangbay"]
    secondary_collections = ["hangbanve", "hangve", "loaichuyendi", "ve", "datve"]
    
    def preload_batch(collections, batch_name):
        if not collections:
            return {}
        print(f"📦 Preloading {batch_name}...")
        return preload_collections(collections)
    
    # Preload priority collections first
    print("🎯 Loading priority data...")
    priority_results = preload_batch(priority_collections, "priority collections")
    
    # Preload secondary collections in parallel
    print("📚 Loading secondary data...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        secondary_future = executor.submit(preload_batch, secondary_collections, "secondary collections")
        try:
            secondary_results = secondary_future.result(timeout=15)
        except concurrent.futures.TimeoutError:
            print("⚠️ Secondary preload timeout - continuing...")
            secondary_results = {}
    
    # Display final status
    cache_status = get_cache_status()
    total_records = sum(
        details.get('record_count', 0) for details in cache_status['cache_details'].values()
        if isinstance(details.get('record_count'), int)
    )
    
    print(f"✅ Cache ready: {cache_status['cache_count']} collections, {total_records} total records")
    print("🎯 Flight Booking API is ready for high-speed queries!")
    
    yield  # Application runs here
    
    print("🛑 Shutting down...")
    clear_all_cache()

app = FastAPI(
    lifespan=lifespan,
    title="Flight Booking API",
    description="High-Performance Flight Booking System",
    version="2.0.0"
)

# Health check
@app.get("/health")
async def health_check():
    """API health status with cache info"""
    cache_status = get_cache_status()
    return {
        "status": "healthy",
        "cache_info": cache_status,
        "message": "Flight Booking API is running"
    }

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({
            "detail": exc.errors(),
            "message": "Validation failed"
        }),
    )

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers (using actual collection names as endpoints)
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
        workers=1
    )
