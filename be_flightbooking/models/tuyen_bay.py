from pydantic import BaseModel# type: ignore

class TuyenBay(BaseModel):
    ma_tuyen_bay: str
    ma_san_bay_di: str
    ma_san_bay_den: str