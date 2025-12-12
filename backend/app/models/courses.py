from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Numeric, Integer, ForeignKey
from decimal import Decimal
from app.db.base import Base


class Course(Base):
    __tablename__ = "courses"

    courseid: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    duration: Mapped[str | None] = mapped_column(String(50))
    teacherid: Mapped[int] = mapped_column(
        ForeignKey("teachers.teacherid"), nullable=False
    )

    teacher = relationship("Teacher", back_populates="courses")
    groups = relationship("Group", back_populates="course")
    assignments = relationship("Assignment", back_populates="course")
    schedule: Mapped[list["Schedule"]] = relationship("Schedule", back_populates="course")
