from pydantic import BaseModel


class TeacherBase(BaseModel):
    fio: str
    specialization: str
    experience: int | None = None
    email: str | None = None


class TeacherCreate(TeacherBase):
    pass


class TeacherOut(TeacherBase):
    teacherid: int

    class Config:
        orm_mode = True
