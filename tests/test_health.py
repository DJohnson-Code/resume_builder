"""
Test health endpoint and basic API functionality.
This establishes a testing baseline for the FastAPI application.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health_endpoint():
    """Test that the health endpoint returns a successful response."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_resume_validation_endpoint():
    """Test the resume validation endpoint with sample data."""
    sample_resume = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+15551234567",
        "skills": ["Python", "FastAPI", "SQL"]
    }
    
    response = client.post("/api/resume/validate", json=sample_resume)
    assert response.status_code == 200
    
    data = response.json()
    assert data["ok"] is True
    assert data["cleaned_name"] == "John Doe"
    assert data["cleaned_email"] == "john@example.com"
    assert data["cleaned_phone"] == "+15551234567"
    assert "Python" in data["cleaned_skills"]


def test_api_docs_available():
    """Test that the API documentation is accessible."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_schema():
    """Test that the OpenAPI schema is available."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert "openapi" in response.json()
