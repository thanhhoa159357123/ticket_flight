from pydantic import BaseModel# type: ignore
from datetime import datetime

class ChuyenBay(BaseModel):
    ma_chuyen_bay: str
    gio_di: datetime
    gio_den: datetime
    trang_thai: str
    ma_hang_bay: str
    ma_tuyen_bay: str
