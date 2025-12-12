"""jwt refresh + teacher extra fields

Revision ID: daec3c1cf85a
Revises: a54744dcf7d3
Create Date: 2025-12-11 19:04:45.211931

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from uuid import uuid4

# revision identifiers, used by Alembic.
revision = 'daec3c1cf85a'
down_revision = 'a54744dcf7d3'
branch_labels = None
depends_on = None


def upgrade():

    # 2. Создаём refresh_sessions
    op.create_table(
        'refresh_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE')),
        sa.Column('token', sa.String(), nullable=False, unique=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    )

    # 3. Добавляем поля в teachers
    op.add_column('teachers', sa.Column('phone', sa.String(), nullable=True))
    op.add_column('teachers', sa.Column('age', sa.Integer(), nullable=True))
    op.add_column('teachers', sa.Column('gender', sa.String(), nullable=True))


def downgrade():
    # 1. Удаляем новые поля из teachers
    op.drop_column('teachers', 'gender')
    op.drop_column('teachers', 'age')
    op.drop_column('teachers', 'phone')

    # 2. Удаляем refresh_sessions
    op.drop_table('refresh_sessions')


