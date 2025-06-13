from pydantic import BaseModel# type: ignore
from typing import Optional
from datetime import date

class HanhKhach(BaseModel):
    ma_hanh_khach: str
    ten_hanh_khach: str
    so_dien_thoai: str
    ngay_sinh: date