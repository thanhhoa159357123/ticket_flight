from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DatVe(BaseModel):
    ma_dat_ve: str
    ma_khach_hang: str
    ngay_dat: Optional[datetime]
    trang_thai: Optional[str]
    loai_chuyen_di: Optional[str]
    ma_hang_ve: Optional[str]
    ma_chuyen_bay: Optional[str]