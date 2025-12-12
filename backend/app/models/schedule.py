from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, Time, Integer, ForeignKey
from app.db.base import Base

class Schedule(Base):
    __tablename__ = "schedule"

    scheduleid: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[Date] = mapped_column(Date)
    time: Mapped[Time] = mapped_column(Time)
    type: Mapped[str | None] = mapped_column(String(50))

    groupid: Mapped[int] = mapped_column(ForeignKey("groups.groupid"))
    courseid: Mapped[int] = mapped_column(ForeignKey("courses.courseid"))
    teacherid: Mapped[int] = mapped_column(ForeignKey("teachers.teacherid"))

    group = relationship("Group", back_populates="schedule")
    course = relationship("Course", back_populates="schedule")
    teacher = relationship("Teacher", back_populates="schedule")
