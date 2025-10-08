# Tests

This directory contains unit tests for the resume builder application.

## Structure

- `test_models.py` - Tests for Pydantic models
- `test_validations.py` - Tests for validation functions
- `test_api.py` - Tests for API endpoints (when implemented)

## Running Tests

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run all tests
pytest

# Run with coverage
pytest --cov=backend

# Run specific test file
pytest tests/test_models.py
```
