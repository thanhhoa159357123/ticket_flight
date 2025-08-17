from pydantic import BaseModel# type: ignore
from datetime import datetime

class ChuyenBay(BaseModel):
    ma_chuyen_bay: str
    thoi_gian_di: datetime
    thoi_gian_den: datetime
    ma_hang_bay: str
    ma_san_bay_di: str
    ma_san_bay_den: str
