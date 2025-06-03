from pydantic import BaseModel# type: ignore
from typing import Optional
from datetime import date

class ChiTietVeDat(BaseModel):
    ma_dat_ve: str
    ngay_khoi_hanh: date
    ma_gia_ve: str
    ma_hanh_khach: str