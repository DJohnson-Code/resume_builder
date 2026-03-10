# Tests

This directory contains the current API test suite for the resume builder application.

## Structure

- `conftest.py` - Shared pytest fixtures for deterministic test config
- `test_health.py` - Health endpoint coverage
- `test_resume_versioning.py` - Versioned resume route coverage
- `test_generate_auth.py` - `/generate` auth coverage

## Running Tests

```bash
poetry run pytest -v
```
