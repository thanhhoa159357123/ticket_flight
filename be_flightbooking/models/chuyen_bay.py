from pydantic import BaseModel# type: ignore
from typing import Optional

class ChuyenBay(BaseModel):
    ma_chuyen_bay: str
    gio_di: str
    gio_den: str
    trang_thai: Optional[str]
    ma_hang_bay: str
    ma_tuyen_bay: str