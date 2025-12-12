from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class AssignmentFile(Base):
    __tablename__ = "assignment_files"

    id = Column(Integer, primary_key=True)
    assignment_id = Column(Integer, ForeignKey("assignments.assignmentid", ondelete="CASCADE"), nullable=False)

    file_path = Column(Text, nullable=False)
    original_name = Column(Text, nullable=False)
    mime_type = Column(Text, nullable=True)

    uploaded_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    uploaded_by = Column(Integer, ForeignKey("teachers.teacherid", ondelete="SET NULL"))

    assignment = relationship("Assignment")
    teacher = relationship("Teacher")
