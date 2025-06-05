from pydantic import BaseModel # type: ignore

class HangBay(BaseModel):
    ma_hang_bay: str
    ten_hang_bay: str
    iata_code: str
    quoc_gia: str