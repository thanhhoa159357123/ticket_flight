from pydantic import BaseModel, validator
from typing import List, Optional, Union

class ChiTietVeDat(BaseModel):
    ma_dat_ve: Optional[str] = None
    ma_ve: Union[str, List[str]]  # ✅ Hỗ trợ cả string và array
    ma_hanh_khach: Union[str, List[str]]  # Chấp nhận cả string và list
    
    @validator('ma_ve')
    def convert_gia_ve_to_list(cls, v):
        if isinstance(v, str):
            return [v]  # Chuyển string thành list cho vé một chiều
        return v  # Giữ nguyên list cho vé khứ hồi
    
    @validator('ma_hanh_khach')
    def convert_hanh_khach_to_list(cls, v):
        if isinstance(v, str):
            return [v]  # Chuyển string thành list
        return v