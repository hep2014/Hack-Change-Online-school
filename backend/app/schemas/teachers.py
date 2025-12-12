from pydantic import BaseModel


class TeacherBase(BaseModel):
    teacherid: int
    fio: str
    specialization: str
    experience: int | None = None
    email: str | None = None
    age: int | None = None
    gender: str | None = None
    phone: str | None = None


class TeacherCreate(TeacherBase):
    pass


class TeacherOut(TeacherBase):
    teacherid: int

    class Config:
        orm_mode = True
