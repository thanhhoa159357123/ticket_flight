from pydantic import BaseModel
from datetime import datetime

class HoaDon(BaseModel):
    ma_hoa_don: str
    ngay_thanh_toan: datetime
    tong_tien: float
    phuong_thuc: str
    ghi_chu: str
    ma_dat_ve: str
    