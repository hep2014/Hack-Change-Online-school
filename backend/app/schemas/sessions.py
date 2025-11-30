from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class SessionBase(BaseModel):
    user_id: UUID
    created_at: datetime
    expires_at: datetime


class SessionCreate(SessionBase):
    pass


class SessionOut(SessionBase):
    token: UUID

    class Config:
        orm_mode = True
