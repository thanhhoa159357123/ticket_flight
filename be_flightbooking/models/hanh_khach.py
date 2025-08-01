from pydantic import BaseModel, Field # type: ignore
from typing import Optional
from datetime import date

class HanhKhach(BaseModel):
    ma_hanh_khach: Optional[str] = Field(default=None)
    danh_xung: str
    ten_hanh_khach: str
    ho_hanh_khach: str
    ngay_sinh: date
    quoc_tich: str