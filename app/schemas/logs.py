from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class LogBase(BaseModel):
    usertype: Literal["Student", "Teacher", "Mentor", "Admin"]
    userid: int
    action: str
    actiontime: datetime | None = None


class LogCreate(LogBase):
    pass


class LogOut(LogBase):
    logid: int

    class Config:
        orm_mode = True
