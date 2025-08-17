from pydantic import BaseModel
from typing import Optional
from datetime import date

class HoaDon(BaseModel):
    ma_hoa_don: Optional[str] = None  # Không bắt buộc khi tạo mới
    ngay_thanh_toan: date
    tong_tien: float
    phuong_thuc: str
    ghi_chu: str
    ma_dat_ve: str
