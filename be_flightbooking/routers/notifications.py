from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from utils.env_loader import MONGO_DB, MONGO_URI
from datetime import datetime

router = APIRouter()

# MongoDB connection
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
dat_ve_collection = db["dat_ve"]

@router.get("/refund-requests", tags=["notifications"])  
def get_refund_requests():
    try:
        # 🔧 Chỉ dùng MongoDB dat_ve collection
        requests_cursor = dat_ve_collection.find({
            "$or": [
                {"trang_thai": "Chờ duyệt hoàn vé"},
                {"trang_thai": "Đã hoàn vé"},
                {
                    "trang_thai": "Đã thanh toán", 
                    "trang_thai_duyet": "Từ chối"  # Vé bị từ chối hoàn
                }
            ]
        }).sort([("ngay_yeu_cau_hoan", -1), ("ngay_dat", -1)])
        
        requests = []
        for doc in requests_cursor:
            # Convert ObjectId to string
            doc["_id"] = str(doc["_id"])
            
            # Convert datetime fields to ISO format
            for key, value in doc.items():
                if isinstance(value, datetime):
                    doc[key] = value.isoformat()
            
            requests.append(doc)
        
        return JSONResponse(content={
            "requests": requests,
            "total": len(requests)
        })
    
    except Exception as e:
        print(f"❌ Lỗi get refund requests: {e}")
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")