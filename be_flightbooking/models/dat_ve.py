from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class DatVe(BaseModel):
    ma_dat_ve: Optional[str] = None  # Cho phép backend tự sinh mã
    ngay_dat: datetime
    trang_thai: str
    ma_khach_hang: str
    
    # === Fields cũ (backward compatibility) ===
    # ma_chuyen_di: Optional[str] = None
    # ma_hang_ve: Optional[str] = None
    # ma_tuyen_bay: Optional[str] = None
    
    # === Fields mới (cho vé khứ hồi) ===
    loai_chuyen_di: Optional[str] = "Một chiều"  # Default
    ma_hang_ve_di: Optional[str] = None
    ma_tuyen_bay_di: Optional[str] = None
    ma_hang_ve_ve: Optional[str] = None
    ma_tuyen_bay_ve: Optional[str] = None
    
    @validator('ma_hang_ve_di', pre=True, always=True)
    def set_hang_ve_di(cls, v, values):
        # Nếu không có ma_hang_ve_di, dùng ma_hang_ve (backward compatibility)
        return v or values.get('ma_hang_ve')
    
    @validator('ma_tuyen_bay_di', pre=True, always=True)
    def set_tuyen_bay_di(cls, v, values):
        # Nếu không có ma_tuyen_bay_di, dùng ma_tuyen_bay (backward compatibility)
        return v or values.get('ma_tuyen_bay')
    
    @validator('ma_hang_ve_ve')
    def validate_hang_ve_ve(cls, v, values):
        if values.get('loai_chuyen_di') == "Khứ hồi" and not v:
            raise ValueError('Vé khứ hồi cần ma_hang_ve_ve')
        return v
    
    @validator('ma_tuyen_bay_ve')
    def validate_tuyen_bay_ve(cls, v, values):
        if values.get('loai_chuyen_di') == "Khứ hồi" and not v:
            raise ValueError('Vé khứ hồi cần ma_tuyen_bay_ve')
        return v
