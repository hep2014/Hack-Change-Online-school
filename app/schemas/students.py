from pydantic import BaseModel
from datetime import date


class StudentBase(BaseModel):
    fio: str
    birthdate: date | None = None
    email: str | None = None
    phone: str | None = None
    registrationdate: date | None = None


class StudentCreate(StudentBase):
    pass


class StudentOut(StudentBase):
    studentid: int

    class Config:
        orm_mode = True
