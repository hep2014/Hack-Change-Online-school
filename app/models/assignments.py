from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, Text, Integer, Enum, ForeignKey
from app.db.base import Base
from datetime import date

class Assignment(Base):
    __tablename__ = "assignments"
    __table_args__ = {"schema": "app"}

    assignmentid: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(
        Enum('Домашнее задание', 'Контрольная работа', 'Тест', name="assignment_type")
    )
    deadline: Mapped[date] = mapped_column(Date)
    description: Mapped[str | None] = mapped_column(Text)
    courseid: Mapped[int] = mapped_column(ForeignKey("app.courses.courseid"))

    course = relationship("Course", back_populates="assignments")
    results = relationship("AssignmentResult", back_populates="assignment")
