from sqlalchemy import Column, Integer, String, Text, DateTime, CheckConstraint
from app.db.base import Base


class Log(Base):
    __tablename__ = "logs"

    logid = Column(Integer, primary_key=True)
    usertype = Column(String(50), CheckConstraint("usertype IN ('Student','Teacher','Mentor','Admin')"))
    userid = Column(Integer, nullable=False)
    action = Column(Text, nullable=False)
    actiontime = Column(DateTime)
