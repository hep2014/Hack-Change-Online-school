from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, ForeignKey
from app.db.base import Base
from datetime import date
class StudentGroup(Base):
    __tablename__ = "student_group"
    __table_args__ = {"schema": "app"}

    studentid: Mapped[int] = mapped_column(ForeignKey("app.students.studentid"), primary_key=True)
    groupid: Mapped[int] = mapped_column(ForeignKey("app.groups.groupid"), primary_key=True)
    joindate: Mapped[date] = mapped_column(Date)

    # вот это и было критично:
    student = relationship("Student", back_populates="groups")
    group = relationship("Group", back_populates="students")
