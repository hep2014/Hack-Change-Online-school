from pydantic import BaseModel
from datetime import timedelta
from decimal import Decimal


class CourseBase(BaseModel):
    title: str
    description: str | None = None
    price: Decimal | None = None
    duration: timedelta | None = None
    teacherid: int | None = None


class CourseCreate(CourseBase):
    pass


class CourseOut(CourseBase):
    courseid: int

    class Config:
        orm_mode = True
