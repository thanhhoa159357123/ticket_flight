from pydantic import BaseModel # type: ignore
from typing import Optional

class HangVe(BaseModel):
    ma_hang_ve: str
    ten_hang_ve: str
    so_kg_hanh_ly_ky_gui: int
    so_kg_hanh_ly_xach_tay: int
    so_do_ghe: str
    khoang_cach_ghe: str
    refundable: bool
    changeable: bool