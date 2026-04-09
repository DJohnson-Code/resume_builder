from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from config import settings


_engine: AsyncEngine | None = None
_async_session_local: async_sessionmaker[AsyncSession] | None = None


def get_engine() -> AsyncEngine:
    global _engine

    if _engine is not None:
        return _engine

    if not settings.DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not configured.")

    _engine = create_async_engine(settings.DATABASE_URL)
    return _engine


def get_sessionmaker() -> async_sessionmaker[AsyncSession]:
    global _async_session_local

    if _async_session_local is not None:
        return _async_session_local

    engine = get_engine()
    _async_session_local = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    return _async_session_local


async def get_db():
    try:
        sessionmaker = get_sessionmaker()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Database not configured") from exc

    async with sessionmaker() as session:
        yield session 
