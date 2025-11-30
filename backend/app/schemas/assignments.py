from pydantic import BaseModel
from datetime import date
from typing import Literal


class AssignmentBase(BaseModel):
    title: str
    type: Literal["Домашнее задание", "Контрольная работа", "Тест"]
    deadline: date | None = None
    description: str | None = None
    courseid: int


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentOut(AssignmentBase):
    assignmentid: int

    class Config:
        orm_mode = True
