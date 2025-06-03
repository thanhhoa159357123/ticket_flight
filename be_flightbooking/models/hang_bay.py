from pydantic import BaseModel # type: ignore
from typing import Optional

class HangBay(BaseModel):
    ma_hang_bay: str
    ten_hang_bay: str
    iata_code: Optional[str]
    quoc_gia: Optional[str]