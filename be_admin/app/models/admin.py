from pydantic import BaseModel
from datetime import datetime, timezone

class AdminCreate(BaseModel):
    username: str
    password: str

class Admin(AdminCreate):
    id: str
    is_active: bool = True
    deleted_at: str = ""
    last_active_at: str = ""
    created_at: str = datetime.now(timezone.utc).isoformat()