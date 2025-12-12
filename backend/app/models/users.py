from __future__ import annotations

import uuid
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=sa.text("gen_random_uuid()"),
    )

    email: Mapped[str] = mapped_column(
        sa.String, nullable=False, unique=True
    )

    password_hash: Mapped[str] = mapped_column(
        sa.String, nullable=False
    )

    role: Mapped[str] = mapped_column(
        sa.String, nullable=False, server_default="student"
    )

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime, nullable=False, server_default=sa.text("now()")
    )
