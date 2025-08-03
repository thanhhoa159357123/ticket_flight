from pydantic import BaseModel
from typing import Optional

class DatVe(BaseModel):
    ma_dat_ve: str
    ma_khach_hang: str
    ngay_dat: Optional[str]
    trang_thai: Optional[str]
    loai_chuyen_di: Optional[str]
    ma_hang_ve_di: Optional[str]
    ma_tuyen_bay_di: Optional[str]
    ma_hang_ve_ve: Optional[str]
    ma_tuyen_bay_ve: Optional[str]