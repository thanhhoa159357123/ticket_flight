from pydantic import BaseModel# type: ignore
from typing import Optional

class SanBay(BaseModel):
    ma_san_bay: str
    ten_san_bay: str
    thanh_pho: str
    ma_quoc_gia: Optional[str]
    iata_code: Optional[str]