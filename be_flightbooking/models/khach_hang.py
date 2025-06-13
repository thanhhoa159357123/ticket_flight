from pydantic import BaseModel
from datetime import datetime, timezone

class KhachHangCreate(BaseModel):
    ten_khach_hang: str
    so_dien_thoai: str
    email: str
    matkhau: str

class KhachHang(KhachHangCreate):
    ma_khach_hang: str
    da_dat_ve: bool = False
    is_active: bool = True
    deleted_at: str = ""
    last_active_at: str = ""
    created_at: str = datetime.now(timezone.utc).isoformat()

