from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date
from app.db.base import Base


class Student(Base):
    __tablename__ = "students"

    studentid: Mapped[int] = mapped_column(primary_key=True)
    fio: Mapped[str] = mapped_column(String(100), nullable=False)
    birthdate: Mapped[Date] = mapped_column(Date)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    phone: Mapped[str] = mapped_column(String(100), unique=True)
    registrationdate: Mapped[Date] = mapped_column(Date)

    groups: Mapped[list["StudentGroup"]] = relationship(back_populates="student")
    results: Mapped[list["AssignmentResult"]] = relationship(back_populates="student")
