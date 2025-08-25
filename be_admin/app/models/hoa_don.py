from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class HoaDonBase(BaseModel):
    ma_hoa_don: str
    ngay_thanh_toan: date
    tong_tien: float
    phuong_thuc: str
    ghi_chu: Optional[str] = None
    ma_dat_ve: str

    class Config:
        orm_mode = True