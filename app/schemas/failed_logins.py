from pydantic import BaseModel
from datetime import datetime


class FailedLoginBase(BaseModel):
    email: str
    attempted_at: datetime


class FailedLoginCreate(FailedLoginBase):
    pass


class FailedLoginOut(FailedLoginBase):
    id: int

    class Config:
        orm_mode = True
