from pydantic import BaseModel
from datetime import date


class GroupBase(BaseModel):
    title: str
    creationdate: date | None = None
    courseid: int


class GroupCreate(GroupBase):
    pass


class GroupOut(GroupBase):
    groupid: int

    class Config:
        orm_mode = True
