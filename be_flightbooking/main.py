# main.py
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import concurrent.futures
from routers import (
    auth, khach_hang, hang_bay, hang_ban_ve, san_bay, tuyen_bay,
    chuyen_bay, hang_ve, loai_chuyen_di, gia_ve, dat_ve, hanh_khach,
    chi_tiet_ve_dat, hoa_don, notifications
)
from utils.spark import init_spark, load_df, get_cache_status
from utils.spark_views import init_spark_views


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Optimized application lifespan with parallel loading"""
    print("🚀 Starting application initialization...")
    
    # Initialize Spark first
    init_spark()
    
    # Priority collections for faster startup
    priority_collections = ["khach_hang", "chuyen_bay", "san_bay"]
    secondary_collections = ["hang_bay", "hang_ban_ve", "loai_chuyen_di", "tuyen_bay", "hang_ve", "gia_ve"]
    
    def preload_collection(collection_name):
        """Preload a single collection"""
        try:
            df = load_df(collection_name)
            count = df.count()  # Trigger materialization
            print(f"✅ Preloaded {collection_name}: {count} records")
            return collection_name, True
        except Exception as e:
            print(f"❌ Failed to preload {collection_name}: {e}")
            return collection_name, False

    # Preload priority collections first (synchronously)
    print("🔥 Preloading priority collections...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        priority_futures = [executor.submit(preload_collection, col) for col in priority_collections]
        for future in concurrent.futures.as_completed(priority_futures):
            collection, success = future.result()
            if success:
                print(f"⚡ Priority collection ready: {collection}")

    # Preload secondary collections (in background)
    print("📦 Preloading secondary collections...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        secondary_futures = [executor.submit(preload_collection, col) for col in secondary_collections]
        concurrent.futures.wait(secondary_futures, timeout=30)  # Wait max 30s

    # Initialize Spark views
    print("🔧 Initializing Spark views...")
    init_spark_views()
    
    # Print cache status
    cache_status = get_cache_status()
    print(f"📊 Cache status: {cache_status}")
    print("✅ Application startup completed!")
    
    yield  # Application runs here
    
    # Cleanup on shutdown
    print("🛑 Shutting down application...")

app = FastAPI(
    lifespan=lifespan,
    title="Flight Booking API",
    description="Optimized Flight Booking System with PySpark",
    version="2.0.0"
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint with cache status"""
    cache_status = get_cache_status()
    return {
        "status": "healthy",
        "cache_info": cache_status,
        "message": "Flight Booking API is running"
    }

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("❌ Validation error:")
    for error in exc.errors():
        print(f"  - {error}")
    
    try:
        payload = await request.json()
        print(f"📦 Request payload: {payload}")
    except Exception:
        print("📦 Could not read request payload")

    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({
            "detail": exc.errors(),
            "message": "Validation failed"
        }),
    )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
routers_config = [
    (auth.router, "/auth"),
    (khach_hang.router, "/api/khach-hang"),
    (hang_bay.router, "/api/hang-bay"),
    (hang_ban_ve.router, "/api/hang-ban-ve"),
    (san_bay.router, "/api/san-bay"),
    (tuyen_bay.router, "/api/tuyen-bay"),
    (chuyen_bay.router, "/api/chuyen-bay"),
    (hang_ve.router, "/api/hang-ve"),
    (loai_chuyen_di.router, "/api/loai-chuyen-di"),
    (gia_ve.router, "/api/gia-ve"),
    (dat_ve.router, "/api/dat-ve"),
    (hanh_khach.router, "/api/hanh-khach"),
    (chi_tiet_ve_dat.router, "/api/chi-tiet-ve-dat"),
    (hoa_don.router, "/api/hoa-don"),
    (notifications.router, "/api/notifications"),
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
        access_log=False  # Disable access log for better performance
    )
