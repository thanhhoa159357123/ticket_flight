from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from models.hoa_don import HoaDon
from uuid import uuid4
from datetime import datetime
from utils.env_loader import MONGO_DB, MONGO_URI

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
dat_ve_collection = db["dat_ve"]
hoa_don_collection = db["hoa_don"]


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
    hoa_don_data["ma_hoa_don"] = str(uuid4())  # Tạo mã hóa đơn
    # hoa_don_data["ngay_thanh_toan"] = datetime.now().date()  # ✅ Chỉ lấy phần ngày
    hoa_don_collection.insert_one(hoa_don_data)

    return {
        "message": "Thanh toán thành công, hóa đơn đã được lưu",
        "ma_hoa_don": hoa_don_data["ma_hoa_don"],
    }
