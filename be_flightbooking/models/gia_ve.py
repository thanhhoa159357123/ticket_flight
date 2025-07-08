from pydantic import BaseModel# type: ignore

class GiaVe(BaseModel):
    ma_gia_ve: str
    gia: float
    ma_hang_ve: str
    ma_chuyen_bay: str
    ma_hang_ban_ve: str
    ma_chuyen_di: str
    goi_ve: str