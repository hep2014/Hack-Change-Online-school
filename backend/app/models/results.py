from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, Date, ForeignKey
from app.db.base import Base
from datetime import date

class AssignmentResult(Base):
    __tablename__ = "results"

    resultid: Mapped[int] = mapped_column(primary_key=True)
    grade: Mapped[int] = mapped_column(Integer)
    submissiondate: Mapped[date] = mapped_column(Date)
    comment: Mapped[str | None] = mapped_column(Text)
    assignmentid: Mapped[int] = mapped_column(ForeignKey("assignments.assignmentid"))
    studentid: Mapped[int] = mapped_column(ForeignKey("students.studentid"))

    assignment = relationship("Assignment", back_populates="results")
    student = relationship("Student", back_populates="results")
