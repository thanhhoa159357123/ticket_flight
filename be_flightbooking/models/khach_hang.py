from pydantic import BaseModel

class KhachHangCreate(BaseModel):
    ten_khach_hang: str
    so_dien_thoai: str
    email: str
    matkhau: str

class KhachHang(KhachHangCreate):
    ma_khach_hang: str  # dùng trong DB
