from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ChuyenBay(BaseModel):
    ma_chuyen_bay: str = Field(..., description="Mã chuyến bay")
    thoi_gian_di: Optional[str]
    thoi_gian_den: Optional[str]
    ma_hang_bay: str = Field(..., description="Mã hãng bay")
    ma_san_bay_di: str = Field(..., description="Mã sân bay đi")
    ma_san_bay_den: str = Field(..., description="Mã sân bay đến")

