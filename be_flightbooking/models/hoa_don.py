from pydantic import BaseModel# type: ignore
from typing import Optional
from datetime import date

class HoaDon(BaseModel):
    ma_hoa_don: str
    ngay_thanh_toan: date
    tong_tien: float
    phuong_thuc: str
    ghi_chu: str
    ma_dat_ve: str