from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer
from app.db.base import Base
from app.models.courses import Course

class Teacher(Base):
    __tablename__ = "teachers"

    teacherid: Mapped[int] = mapped_column(primary_key=True)
    fio: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(100), nullable=False)
    experience: Mapped[int] = mapped_column(Integer)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gender: Mapped[str | None] = mapped_column(String, nullable=True)
    courses: Mapped[list["Course"]] = relationship(back_populates="teacher")
    schedule: Mapped[list["Schedule"]] = relationship("Schedule", back_populates="teacher")
