from pydantic import BaseModel
from datetime import date


class StudentGroupBase(BaseModel):
    studentid: int
    groupid: int
    joindate: date | None = None


class StudentGroupCreate(StudentGroupBase):
    pass


class StudentGroupOut(StudentGroupBase):
    class Config:
        orm_mode = True
