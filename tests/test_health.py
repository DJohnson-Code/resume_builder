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
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint():
    """Test that the root endpoint returns a successful response."""
    response = client.get("/")
    assert response.status_code == 200
    # Add more specific assertions based on your root endpoint implementation


def test_api_docs_available():
    """Test that the API documentation is accessible."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_schema():
    """Test that the OpenAPI schema is available."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert "openapi" in response.json()
