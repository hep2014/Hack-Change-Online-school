from pydantic import BaseModel
from datetime import date, time


class ScheduleBase(BaseModel):
    date: date | None = None
    time: time | None = None
    type: str | None = None
    groupid: int
    courseid: int
    teacherid: int


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleOut(ScheduleBase):
    scheduleid: int

    class Config:
        orm_mode = True
