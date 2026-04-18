from __future__ import annotations
from fastapi import HTTPException   

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from config import settings

_engine: AsyncEngine | None = None
_async_session_local: async_sessionmaker[AsyncSession] | None = None


def init_db(): 
    global _engine, _async_session_local

    if _async_session_local is not None: 
        return
    
    if not settings.DATABASE_URL: 
        return 

    _engine = create_async_engine(settings.DATABASE_URL)

    _async_session_local = async_sessionmaker(
        _engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )   

async def dispose_db(): 
    global _engine, _async_session_local 

    if _engine is not None: 
        await _engine.dispose()

    _engine = None
    _async_session_local = None


async def get_db(): 
    if _async_session_local is None: 
        raise HTTPException(status_code=503, detail="Database not configured") 
    
    async with _async_session_local() as session:
        yield session

 