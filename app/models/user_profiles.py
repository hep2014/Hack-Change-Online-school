from sqlalchemy import Column, String, Integer, ForeignKey
from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID


class UserProfile(Base):
    __tablename__ = "user_profiles"
    __table_args__ = {"schema": "app"}

    user_id = Column(UUID(as_uuid=True), ForeignKey("app.users.id"), primary_key=True)
    student_id = Column(Integer)
    teacher_id = Column(Integer)
    mentor_id = Column(Integer)
