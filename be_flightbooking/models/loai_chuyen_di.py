from pydantic import BaseModel# type: ignore

class LoaiChuyenDi(BaseModel):
    ma_chuyen_di: str
    ten_chuyen_di: str
    mo_ta: str