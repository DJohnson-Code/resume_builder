import pytest
from httpx import ASGITransport, AsyncClient

from main import app


@pytest.mark.asyncio
async def test_validate_resume_v1_route_exists():
    payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+18165551234",
        "skills": ["Python"],
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post("/api/v1/resume/validate", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["cleaned_name"] == "John Doe"


@pytest.mark.asyncio
async def test_unversioned_validate_route_not_found():
    payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+18165551234",
        "skills": ["Python"],
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post("/api/resume/validate", json=payload)

    assert response.status_code == 404
