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
    load_df("hangbay")
    load_df("hang_ban_ve")
    load_df("khachhang")
    load_df("san_bay")
    load_df("tuyen_bay")
    load_df("chuyenbay")
    load_df("hangve")
    load_df("datve")
    load_df("ve")
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
app.include_router(hangBay.router, prefix="/hangbay")
app.include_router(hangBanVe.router, prefix='/hangbanve')
app.include_router(khachHang.router,prefix='/khachhang')
app.include_router(sanBay.router,prefix='/san_bay')
#app.include_router(tuyenBay.router,prefix='/tuyenbay')
app.include_router(chuyenBay.router,prefix='/chuyenbay')
app.include_router(hangVe.router,prefix='/hangve')
app.include_router(datVe.router, prefix="/datve")
app.include_router(giaVe.router, prefix='/ve')
app.include_router(hoaDon.router, prefix='/hoadon')
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)