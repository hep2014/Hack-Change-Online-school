from sqlalchemy import Column, BigInteger, Text, DateTime
from app.db.base import Base


class FailedLogin(Base):
    __tablename__ = "failed_logins"

    id = Column(BigInteger, primary_key=True)
    email = Column(Text, nullable=False)
    attempted_at = Column(DateTime, nullable=False)
