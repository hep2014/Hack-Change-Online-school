from logging.config import fileConfig
from alembic import context

from sqlalchemy import create_engine
from app.db.base import Base  # ваша базовая модель
from app.db.session import DATABASE_URL

# Alembic Config object
config = context.config

# Переводим async URL в sync URL
sync_url = DATABASE_URL.replace("+asyncpg", "+psycopg")
config.set_main_option("sqlalchemy.url", sync_url)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# metadata для автогенерации
target_metadata = Base.metadata

# импорт моделей, чтобы metadata знала о таблицах
from app.models import (
    assignments,
    courses,
    failed_logins,
    groups,
    logs,
    results,
    schedule,
    student_groups,
    students,
    teachers,
    user_profiles,
    users
)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        include_schemas=True,
        version_table_schema="public",
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # создаём engine в AUTOCOMMIT
    connectable = create_engine(
        sync_url,
        isolation_level="AUTOCOMMIT",
        future=True,
    )

    with connectable.connect() as connection:
        connection.exec_driver_sql("SET search_path TO public;")

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
            version_table_schema="public",
            transactional_ddl=False,        # ключевой момент
            transaction_per_migration=False,
        )

        # тут транзакция "логическая" alembic'а, но не SQL-транзакция
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
