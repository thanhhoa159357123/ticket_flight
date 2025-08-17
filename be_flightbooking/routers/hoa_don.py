from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from models.hoa_don import HoaDon
from utils.spark import invalidate_cache
from uuid import uuid4
from datetime import datetime, date
from utils.env_loader import MONGO_DB, MONGO_URI

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
dat_ve_collection = db["datve"]
hoa_don_collection = db["hoadon"]

@router.post("/thanh-toan", tags=["hoa_don"])
def thanh_toan(hoa_don: HoaDon):
    # Cập nhật trạng thái đặt vé
    update_result = dat_ve_collection.update_one(
        {"ma_dat_ve": hoa_don.ma_dat_ve}, {"$set": {"trang_thai": "Đã thanh toán"}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Không tìm thấy mã đặt vé để cập nhật"
        )

    # Thêm hóa đơn
    hoa_don_data = hoa_don.dict()
    hoa_don_data["ma_hoa_don"] = str(uuid4())

    # Chuyển ngay_thanh_toan về string (hỗ trợ cả date và datetime)
    if isinstance(hoa_don_data["ngay_thanh_toan"], (datetime, date)):
        hoa_don_data["ngay_thanh_toan"] = hoa_don_data["ngay_thanh_toan"].strftime("%Y-%m-%d")
    else:
        hoa_don_data["ngay_thanh_toan"] = str(hoa_don_data["ngay_thanh_toan"])

    hoa_don_collection.insert_one(hoa_don_data)
    invalidate_cache("hoadon")

    return {
        "message": "Thanh toán thành công, hóa đơn đã được lưu",
        "ma_hoa_don": hoa_don_data["ma_hoa_don"],
    }
