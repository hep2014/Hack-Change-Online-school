from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, Integer, ForeignKey
from app.db.base import Base
from datetime import date

class Group(Base):
    __tablename__ = "groups"

    groupid: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    creationdate: Mapped[date] = mapped_column(Date)
    courseid: Mapped[int] = mapped_column(
        ForeignKey("courses.courseid"), nullable=False
    )

    course = relationship("Course", back_populates="groups")
    students = relationship("StudentGroup", back_populates="group")
    schedule: Mapped[list["Schedule"]] = relationship("Schedule", back_populates="group")
