from pydantic import BaseModel# type: ignore

class Ve(BaseModel):
    ma_ve: str
    gia_ve: float
    ma_hang_ve: str
    ma_chuyen_bay: str
    ma_hang_ban_ve: str