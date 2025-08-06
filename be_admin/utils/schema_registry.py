from typing import Optional
from app.schemas.hang_bay import hang_bay_schema
from app.schemas.hang_ban_ve import hang_ban_ve_schema
from app.schemas.khach_hang import khach_hang_schema
from app.schemas.san_bay import san_bay_schema
from app.schemas.tuyen_bay import tuyen_bay_schema
from app.schemas.chuyen_bay import chuyen_bay_schema
from app.schemas.hang_ve import hang_ve_schema
from app.schemas.dat_ve import dat_ve_schema
from app.schemas.gia_ve import gia_ve_schema

SCHEMA_REGISTRY = {
    "hang_bay": hang_bay_schema,
    "hang_ban_ve": hang_ban_ve_schema,
    "khach_hang": khach_hang_schema,
    "san_bay": san_bay_schema,
    "tuyen_bay": tuyen_bay_schema,
    "chuyen_bay": chuyen_bay_schema,
    "hang_ve": hang_ve_schema,
    "dat_ve": dat_ve_schema,
    "gia_ve": gia_ve_schema,
    # Thêm các schema khác nếu cần
}

def get_schema(collection_name: str):
    return SCHEMA_REGISTRY.get(collection_name)