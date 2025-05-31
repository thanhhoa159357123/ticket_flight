from pydantic import BaseModel, EmailStr # type: ignore

class KhachHangModel(BaseModel):
    ten_khach_hang: str
    email: EmailStr
    so_dien_thoai: str
    matkhau: str
