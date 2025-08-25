from pydantic import BaseModel

class TuyenBay(BaseModel):
    ma_tuyen_bay : str
    ma_san_bay_di : str
    ma_san_bay_den : str