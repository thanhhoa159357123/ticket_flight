from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VeDienTu(BaseModel):
    ma_ve_dien_tu: str
    ma_dat_ve: str

    pnr: str
    eticket_number: str

    qr_code_base64: Optional[str] = None
    issued_at: datetime

    status: str
    pdf_url: Optional[str] = None
    note: Optional[str] = None
