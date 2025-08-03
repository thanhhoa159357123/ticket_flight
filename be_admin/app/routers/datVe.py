from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from datetime import datetime
from utils.spark import load_df
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB
from pyspark.sql.functions import col, count
from app.models.dat_ve import DatVe
from typing import List
import traceback

router = APIRouter()
client = MongoClient(DATA_MONGO_URI)
dat_ve_collection = client[DATA_MONGO_DB]["dat_ve"]
                                          

@router.get("", response_model=List[DatVe])
def get_all_ve(ma_khach_hang: str = Query(None)):
    try:
        df = load_df("dat_ve")

        # Nếu có tìm theo mã khách hàng
        if ma_khach_hang:
            df = df.filter(df["ma_khach_hang"] == ma_khach_hang)

        # Chuyển Spark DataFrame sang list[dict]
        result = df.toPandas().fillna("").to_dict(orient="records")
        return result

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"message": str(e)})

# Tìm kiếm vé theo mã đặt vé hoặc tên khách hàng
@router.get("/search")
def search_dat_ve(q: str = Query(..., description="Mã đặt vé hoặc tên khách hàng")):
    try:
        df = load_df("dat_ve")
        df_filtered = df.filter(
            (col("ma_dat_ve").contains(q)) | (col("ma_khach_hang").contains(q))
        )
        data = df_filtered.toPandas().fillna("").to_dict(orient="records")
        return JSONResponse(content={"data": data, "message": f"Tìm thấy {len(data)} kết quả"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Lỗi khi tìm kiếm", "detail": str(e)})

# Thống kê số lượng vé đã đặt (toàn bộ hoặc theo mã khách hàng)
@router.get("/thong_ke")
def thong_ke_ve(ma_khach_hang: str = None):
    try:
        df = load_df("dat_ve")

        if ma_khach_hang:
            df_filtered = df.filter(col("ma_khach_hang") == ma_khach_hang)
            total = df_filtered.count()
            return {"ma_khach_hang": ma_khach_hang, "so_luong_ve": total}
        else:
            df_grouped = df.groupBy("ma_khach_hang").agg(count("*").alias("so_luong_ve"))
            data = df_grouped.toPandas().to_dict(orient="records")
            return {"data": data, "message": "Thống kê theo từng khách hàng"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Lỗi khi thống kê", "detail": str(e)})
    
@router.get("/admin/all", tags=["dat_ve", "admin"])
def get_all_dat_ve_admin():
    """Get all booking tickets for admin - no customer filter required"""
    try:
        print("🔍 [ADMIN] Getting all tickets from MongoDB...")
        
        # Get all tickets from MongoDB directly
        mongo_results = list(dat_ve_collection.find({}).sort("ngay_dat", -1))
        
        if not mongo_results:
            print("❌ No tickets found in MongoDB")
            return JSONResponse(content=[])
        
        print(f"✅ Found {len(mongo_results)} tickets in MongoDB")
        
        # Convert MongoDB data to proper format
        formatted_results = []
        for record in mongo_results:
            # Convert ObjectId to string
            record["_id"] = str(record["_id"])
            
            # Handle datetime conversion
            if isinstance(record.get("ngay_dat"), datetime):
                record["ngay_dat"] = record["ngay_dat"].strftime('%Y-%m-%d %H:%M:%S')
            
            # Handle other datetime fields if they exist
            for date_field in ["ngay_yeu_cau_hoan", "ngay_duyet_hoan", "ngay_hoan_ve"]:
                if date_field in record and isinstance(record[date_field], datetime):
                    record[date_field] = record[date_field].strftime('%Y-%m-%d %H:%M:%S')
            
            # Ensure required fields exist with default values
            record.setdefault("trang_thai", "Đang xử lý")
            record.setdefault("loai_chuyen_di", "Một chiều")
            record.setdefault("ma_hang_ve_di", "N/A")
            record.setdefault("ma_tuyen_bay_di", "N/A")
            record.setdefault("ma_hang_ve_ve", None)
            record.setdefault("ma_tuyen_bay_ve", None)
            
            formatted_results.append(record)
        
        print(f"✅ [ADMIN] Successfully formatted {len(formatted_results)} tickets")
        return JSONResponse(content=formatted_results)
        
    except Exception as e:
        print(f"❌ [ADMIN] Error getting all tickets: {e}")
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
