from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest
from fastapi.testclient import TestClient

import db.session as db_session
import main
from config import settings


def test_init_db_skips_setup_when_database_url_missing(monkeypatch):
    monkeypatch.setattr(settings, "DATABASE_URL", None)
    monkeypatch.setattr(db_session, "_engine", None)
    monkeypatch.setattr(db_session, "_async_session_local", None)

    create_engine_mock = Mock()
    sessionmaker_mock = Mock()
    monkeypatch.setattr(db_session, "create_async_engine", create_engine_mock)
    monkeypatch.setattr(db_session, "async_sessionmaker", sessionmaker_mock)

    db_session.init_db()

    create_engine_mock.assert_not_called()
    sessionmaker_mock.assert_not_called()
    assert db_session._engine is None
    assert db_session._async_session_local is None


@pytest.mark.asyncio
async def test_init_db_and_dispose_db_manage_shared_state(monkeypatch):
    fake_engine = SimpleNamespace(dispose=AsyncMock())
    fake_sessionmaker = object()

    monkeypatch.setattr(
        settings,
        "DATABASE_URL",
        "postgresql+asyncpg://test:test@localhost/testdb",
    )
    monkeypatch.setattr(db_session, "_engine", None)
    monkeypatch.setattr(db_session, "_async_session_local", None)

    create_engine_mock = Mock(return_value=fake_engine)
    sessionmaker_mock = Mock(return_value=fake_sessionmaker)
    monkeypatch.setattr(db_session, "create_async_engine", create_engine_mock)
    monkeypatch.setattr(db_session, "async_sessionmaker", sessionmaker_mock)

    db_session.init_db()

    create_engine_mock.assert_called_once_with(settings.DATABASE_URL)
    sessionmaker_mock.assert_called_once_with(
        fake_engine,
        class_=db_session.AsyncSession,
        expire_on_commit=False,
    )
    assert db_session._engine is fake_engine
    assert db_session._async_session_local is fake_sessionmaker

    await db_session.dispose_db()

    fake_engine.dispose.assert_awaited_once()
    assert db_session._engine is None
    assert db_session._async_session_local is None


@pytest.mark.asyncio
async def test_dispose_db_is_safe_when_engine_not_initialized(missing_database_url):
    await db_session.dispose_db()

    assert db_session._engine is None
    assert db_session._async_session_local is None


def test_app_lifespan_calls_db_init_and_dispose(monkeypatch):
    init_mock = Mock()
    dispose_mock = AsyncMock()
    monkeypatch.setattr(main, "init_db", init_mock)
    monkeypatch.setattr(main, "dispose_db", dispose_mock)

    with TestClient(main.app) as client:
        response = client.get("/api/health")

        assert response.status_code == 200
        init_mock.assert_called_once_with()
        dispose_mock.assert_not_awaited()

    dispose_mock.assert_awaited_once_with()
