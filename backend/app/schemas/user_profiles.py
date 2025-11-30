from pydantic import BaseModel
from uuid import UUID


class UserProfileBase(BaseModel):
    student_id: int | None = None
    teacher_id: int | None = None
    mentor_id: int | None = None


class UserProfileCreate(UserProfileBase):
    user_id: UUID


class UserProfileOut(UserProfileBase):
    user_id: UUID

    class Config:
        orm_mode = True
