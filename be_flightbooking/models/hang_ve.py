from pydantic import BaseModel # type: ignore
from typing import Optional

class HangVe(BaseModel):
    ma_hang_ve: str
    vi_tri_ngoi: str
    so_luong_hanh_ly: int
    refundable: bool
    changeable: bool