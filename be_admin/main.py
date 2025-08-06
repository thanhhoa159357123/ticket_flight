from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ( auth , hangBay, hangBanVe,khachHang,sanBay,tuyenBay,chuyenBay,hangVe,datVe,giaVe, dashboard, hoaDon) 

from utils.spark import init_spark, load_df 
@asynccontextmanager
async def lifespan(app: FastAPI):

    # Initialize Spark session
    init_spark()

    #Preload Spark DataFrames improve performance
    load_df("hang_bay")
    load_df("hang_ban_ve")
    load_df("khach_hang")
    load_df("san_bay")
    load_df("tuyen_bay")
    load_df("chuyen_bay")
    load_df("hang_ve")
    load_df("dat_ve")
    load_df("gia_ve")
    load_df("hoa_don")
    print("✅ Spark DataFrames đã được preload")
    

    # Initialize any resources needed at startup
    print("🚀 App is starting up...")
    
    yield  # App continues running



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
# Add other routers here as needed
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(hangBay.router, prefix="/hang_bay")
app.include_router(hangBanVe.router, prefix='/hang_ban_ve')
app.include_router(khachHang.router,prefix='/khach_hang')
app.include_router(sanBay.router,prefix='/san_bay')
app.include_router(tuyenBay.router,prefix='/tuyen_bay')
app.include_router(chuyenBay.router,prefix='/chuyen_bay')
app.include_router(hangVe.router,prefix='/hang_ve')
app.include_router(datVe.router, prefix='/dat_ve')
app.include_router(giaVe.router, prefix='/gia_ve')
app.include_router(hoaDon.router, prefix='/hoa_don')
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)