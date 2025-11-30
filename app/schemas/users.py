from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: str
    password_hash: str
    role: str
    created_at: datetime


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: UUID

    class Config:
        orm_mode = True
