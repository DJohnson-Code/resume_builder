import pytest
from httpx import ASGITransport, AsyncClient

from main import app  

@pytest.mark.asyncio
async def test_generate_missing_api_key_returns_401(): 
    """Verify /generate rejects missing X-API-Key."""

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
        response = await client.post("/api/v1/resume/generate", json=payload)

    assert response.status_code == 401