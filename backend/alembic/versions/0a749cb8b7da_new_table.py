"""new table

Revision ID: 0a749cb8b7da
Revises: daec3c1cf85a
Create Date: 2025-12-11 20:02:09.055061

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0a749cb8b7da'
down_revision: Union[str, Sequence[str], None] = 'daec3c1cf85a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "assignment_files",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("assignment_id", sa.Integer, sa.ForeignKey("assignments.assignmentid", ondelete="CASCADE"), nullable=False),
        sa.Column("file_path", sa.Text, nullable=False),
        sa.Column("original_name", sa.Text, nullable=False),
        sa.Column("mime_type", sa.Text, nullable=True),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("uploaded_by", sa.Integer, sa.ForeignKey("teachers.teacherid", ondelete="SET NULL")),
    )


def downgrade() -> None:
    op.drop_table("assignment_files")
