from pydantic import BaseModel # type: ignore
from typing import Optional

class HangBanVe(BaseModel):
    ma_hang_ban_ve: str
    ten_hang_ban_ve: str
    vai_tro: str