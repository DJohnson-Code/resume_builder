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
