from pydantic import BaseModel # type: ignore
from typing import Optional

class HangVe(BaseModel):
    ma_hang_ve: str
    vi_tri_ngoi: Optional[str]
    so_luong_hanh_ly: Optional[int]
    refundable: Optional[bool]
    changeable: Optional[bool]