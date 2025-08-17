from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime

class DatVe(BaseModel):
    ma_dat_ve: Optional[str] = None
    ngay_dat: datetime = Field(default_factory=datetime.now)
    trang_thai: str = "Chờ xác nhận"
    ma_khach_hang: str
    loai_chuyen_di: str = "Một chiều"
    ma_hang_ve: Union[str, List[str]]
    ma_chuyen_bay: Union[str, List[str]]

    
#     # Optional fields
#     ghi_chu: Optional[str] = None
#     created_at: Optional[datetime] = Field(default_factory=datetime.now)
#     updated_at: Optional[datetime] = Field(default_factory=datetime.now)

#     @validator('ma_dat_ve', pre=True, always=True)
#     def generate_ma_dat_ve(cls, v):
#         if not v:
#             timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
#             random_suffix = str(uuid.uuid4())[:4].upper()
#             return f"DV{timestamp}{random_suffix}"
#         return v

#     @validator('ngay_dat', pre=True, always=True)
#     def set_ngay_dat(cls, v):
#         if isinstance(v, str):
#             try:
#                 return datetime.fromisoformat(v.replace('Z', '+00:00'))
#             except:
#                 return datetime.now()
#         return v or datetime.now()

#     @validator('loai_chuyen_di')
#     def validate_loai_chuyen_di(cls, v):
#         if v not in ["Một chiều", "Khứ hồi"]:
#             raise ValueError('loai_chuyen_di phải là "Một chiều" hoặc "Khứ hồi"')
#         return v

#     @validator('ma_hang_ve')
#     def validate_ma_hang_ve(cls, v, values):
#         loai_chuyen_di = values.get('loai_chuyen_di')
        
#         if loai_chuyen_di == "Một chiều":
#             # Một chiều: phải là string
#             if isinstance(v, list):
#                 raise ValueError('Vé một chiều: ma_hang_ve phải là string, không phải list')
#             if not v or not isinstance(v, str):
#                 raise ValueError('Vé một chiều: ma_hang_ve không được rỗng')
                
#         elif loai_chuyen_di == "Khứ hồi":
#             # Khứ hồi: phải là list có 2 elements
#             if not isinstance(v, list):
#                 raise ValueError('Vé khứ hồi: ma_hang_ve phải là list [ma_hang_ve_di, ma_hang_ve_ve]')
#             if len(v) != 2:
#                 raise ValueError('Vé khứ hồi: ma_hang_ve phải có đúng 2 elements [đi, về]')
#             if not all(v):  # Check all elements are not empty
#                 raise ValueError('Vé khứ hồi: cả 2 ma_hang_ve đều không được rỗng')
                
#         return v

#     @validator('ma_chuyen_bay')
#     def validate_ma_chuyen_bay(cls, v, values):
#         loai_chuyen_di = values.get('loai_chuyen_di')
        
#         if loai_chuyen_di == "Một chiều":
#             # Một chiều: phải là string
#             if isinstance(v, list):
#                 raise ValueError('Vé một chiều: ma_chuyen_bay phải là string, không phải list')
#             if not v or not isinstance(v, str):
#                 raise ValueError('Vé một chiều: ma_chuyen_bay không được rỗng')
                
#         elif loai_chuyen_di == "Khứ hồi":
#             # Khứ hồi: phải là list có 2 elements
#             if not isinstance(v, list):
#                 raise ValueError('Vé khứ hồi: ma_chuyen_bay phải là list [ma_chuyen_bay_di, ma_chuyen_bay_ve]')
#             if len(v) != 2:
#                 raise ValueError('Vé khứ hồi: ma_chuyen_bay phải có đúng 2 elements [đi, về]')
#             if not all(v):  # Check all elements are not empty
#                 raise ValueError('Vé khứ hồi: cả 2 ma_chuyen_bay đều không được rỗng')
                
#         return v

#     @validator('trang_thai')
#     def validate_trang_thai(cls, v):
#         valid_states = [
#             "Chờ xác nhận", "Đã xác nhận", "Đã thanh toán", 
#             "Đã hủy", "Đã hoàn tiền", "Đang xử lý"
#         ]
#         if v not in valid_states:
#             raise ValueError(f'Trạng thái không hợp lệ. Chọn một trong: {", ".join(valid_states)}')
#         return v

#     class Config:
#         extra = "ignore"
#         json_encoders = {
#             datetime: lambda v: v.isoformat()
#         }

#     def dict(self, **kwargs):
#         """Override dict method để handle datetime serialization"""
#         data = super().dict(**kwargs)
#         for key, value in data.items():
#             if isinstance(value, datetime):
#                 data[key] = value.isoformat()
#         return data

#     # 🔥 UTILITY METHODS
#     def get_ma_hang_ve_di(self) -> str:
#         """Lấy mã hạng vé đi"""
#         if isinstance(self.ma_hang_ve, str):
#             return self.ma_hang_ve
#         return self.ma_hang_ve[0]

#     def get_ma_hang_ve_ve(self) -> Optional[str]:
#         """Lấy mã hạng vé về (nếu có)"""
#         if isinstance(self.ma_hang_ve, list) and len(self.ma_hang_ve) > 1:
#             return self.ma_hang_ve[1]
#         return None

#     def get_ma_chuyen_bay_di(self) -> str:
#         """Lấy mã chuyến bay đi"""
#         if isinstance(self.ma_chuyen_bay, str):
#             return self.ma_chuyen_bay
#         return self.ma_chuyen_bay[0]

#     def get_ma_chuyen_bay_ve(self) -> Optional[str]:
#         """Lấy mã chuyến bay về (nếu có)"""
#         if isinstance(self.ma_chuyen_bay, list) and len(self.ma_chuyen_bay) > 1:
#             return self.ma_chuyen_bay[1]
#         return None

# # 🔥 REQUEST MODEL cho API
# class DatVeCreate(BaseModel):
#     ma_khach_hang: str
#     loai_chuyen_di: str = "Một chiều"
#     ma_hang_ve: Union[str, List[str]]
#     ma_chuyen_bay: Union[str, List[str]]
#     ghi_chu: Optional[str] = None
#     trang_thai: Optional[str] = "Chờ xác nhận"
