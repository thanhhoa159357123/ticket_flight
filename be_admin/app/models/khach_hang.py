from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone


# ✅ Dữ liệu đầu vào khi tạo khách hàng
class KhachHangCreate(BaseModel):
    ten_khach_hang: str
    so_dien_thoai: str
    email: str
    matkhau: str


# ✅ Dữ liệu hiển thị hoặc lưu trữ
class KhachHang(KhachHangCreate):
    ma_khach_hang: str
    da_dat_ve: bool = False
    is_active: bool = True
    deleted_at: Optional[str] = ""
    last_active_at: Optional[str] = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    created_at: Optional[str] = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ✅ Dữ liệu cập nhật
class KhachHangUpdate(BaseModel):
    ten_khach_hang: Optional[str] = None
    so_dien_thoai: Optional[str] = None
    email: Optional[str] = None
    matkhau: Optional[str] = None
    is_active: Optional[bool] = None
    da_dat_ve: Optional[bool] = None
    deleted_at: Optional[str] = None
    last_active_at: Optional[str] = None
