import asyncio
import pytest_asyncio
from dotenv import load_dotenv
from httpx import AsyncClient, ASGITransport
from pathlib import Path
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
)
from sqlalchemy.orm import sessionmaker
import os
BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR.parent / ".env"
load_dotenv(ENV_PATH)
from app.main import app
from app.db.session import get_session
from app.db.base import Base


DATABASE_URL = f"postgresql+asyncpg://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/school_test"


@pytest_asyncio.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture()
async def test_engine():
    """
    Создаём отдельный движок PostgreSQL.
    Полностью пересоздаём таблицы перед всеми тестами.
    """
    engine = create_async_engine(DATABASE_URL, echo=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    await engine.dispose()


@pytest_asyncio.fixture()
async def test_session(test_engine):
    """
    Создаём новую сессию на каждый тест.
    """
    async_session = sessionmaker(
        bind=test_engine,
        expire_on_commit=False,
        class_=AsyncSession
    )

    async with async_session() as session:
        yield session


@pytest_asyncio.fixture()
async def client(test_session, monkeypatch):
    async def override_get_session():
        yield test_session

    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test"
    ) as ac:
        yield ac
