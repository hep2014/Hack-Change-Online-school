from pydantic import BaseModel
from datetime import date


class ResultBase(BaseModel):
    grade: int | None = None
    submissiondate: date | None = None
    comment: str | None = None
    assignmentid: int
    studentid: int


class ResultCreate(ResultBase):
    pass


class ResultOut(ResultBase):
    resultid: int

    class Config:
        orm_mode = True
