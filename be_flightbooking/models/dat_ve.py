from pydantic import BaseModel# type: ignore
from typing import Optional
from datetime import date

class DatVe(BaseModel):
    ma_dat_ve: str
    ngay_dat: date
    trang_thai: str
    ma_khach_hang: str
    ma_hanh_khach: str
    ma_chuyen_di: str
    ma_hang_ve: str
    ma_tuyen_bay: str