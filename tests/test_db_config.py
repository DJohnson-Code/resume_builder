import pytest
from httpx import ASGITransport, AsyncClient

from config import settings
from main import app


@pytest.mark.asyncio
async def test_health_endpoint_without_database_url_returns_200(missing_database_url):
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_resume_list_without_database_url_returns_503(
    fixed_api_keys,
    missing_database_url,
):
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get(
            "/api/v1/resume/",
            headers={"X-API-Key": settings.APP_API_KEY},
        )

    assert response.status_code == 503
    assert response.json() == {"detail": "Database not configured"}
