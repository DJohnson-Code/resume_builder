import db.session as db_session
import pytest

from config import settings


@pytest.fixture
def fixed_api_keys():
    old_app_key = settings.APP_API_KEY
    old_openai_key = settings.OPENAI_API_KEY

    settings.APP_API_KEY = "test-app-key"
    settings.OPENAI_API_KEY = "test-openai-key"

    try:
        yield
    finally:
        settings.APP_API_KEY = old_app_key
        settings.OPENAI_API_KEY = old_openai_key


@pytest.fixture
def missing_database_url():
    old_database_url = settings.DATABASE_URL
    old_engine = db_session._engine
    old_sessionmaker = db_session._async_session_local

    settings.DATABASE_URL = None
    db_session._engine = None
    db_session._async_session_local = None

    try:
        yield
    finally:
        settings.DATABASE_URL = old_database_url
        db_session._engine = old_engine
        db_session._async_session_local = old_sessionmaker
