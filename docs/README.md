# Documentation

This directory contains deeper technical documentation for the Resume Builder API.

## Project Overview

The root [README.md](../README.md) is the quick-start guide. This document focuses on architecture, module responsibilities, and internal request flow.

## Architecture

```
User Input (JSON) → Pydantic Validation → Cleaning/Normalization → ResumeOut → LLM Prompt → AI-Enhanced Resume
```

## Core Components

| Component | Description |
|-----------|-------------|
| `models/` | Pydantic In/Out model pairs (Resume, Experience, Education, Certification, Location) |
| `validations/` | Cleaning functions per model (phone → E.164, name title removal, date normalization) |
| `utils/` | Shared helpers (clean_text, title_case, URL normalization, skill deduplication) |
| `services/` | Business logic (validation orchestration, prompt building, AI service, persistence helpers) |
| `routes/` | FastAPI endpoints |
| `db/` | SQLAlchemy async session and ORM models for resumes and generations |

## API Endpoints

### `GET /api/health`
Health check. Returns `{"status": "ok"}`.

### `POST /api/v1/resume/validate`
Accepts raw resume JSON and returns cleaned/validated output.
Requires:
- `APP_API_KEY` configured on the server
- `X-API-Key` request header matching `APP_API_KEY`

### `POST /api/v1/resume/generate`
Accepts raw resume JSON, validates/cleans it, and generates AI-enhanced markdown.
Requires:
- `OPENAI_API_KEY` configured on the server
- `APP_API_KEY` configured on the server
- `X-API-Key` request header matching `APP_API_KEY`

**Request body**: `ResumeIn` schema
**Response**: `ResumeOut` schema with cleaned data + `ai_resume_markdown`

### `GET /api/v1/resume/`
Returns a paginated list of stored resumes.
Requires:
- `APP_API_KEY` configured on the server
- `X-API-Key` request header matching `APP_API_KEY`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | — | Required for the PostgreSQL async database layer |
| `OPENAI_API_KEY` | — | Required for AI generation |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `APP_API_KEY` | — | Required to access `/api/v1/resume/*` |
| `API_HOST` | `127.0.0.1` | Server host |
| `API_PORT` | `8000` | Server port |

## Running Locally

```bash
# Install dependencies
poetry install

# Set environment variables
export DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/resumedb"
export OPENAI_API_KEY="your-key-here"
export APP_API_KEY="your-app-key-here"

# Start server
uvicorn main:app --reload
```

## Request Flow

1. **Input Validation**: Pydantic validates `ResumeIn` (types, required fields, patterns)
2. **Cleaning**: `clean_and_validate_resume()` normalizes all fields
3. **Auth Check**: All `/api/v1/resume/*` routes currently run `verify_api_key`
4. **Prompt Building**: `/generate` uses `build_resume_prompt()` to format data for the model
5. **AI Generation**: `AIService` calls the OpenAI Responses API for `/generate`
6. **Persistence**: `/generate` stores the cleaned resume and generation metadata in the database; `GET /api/v1/resume/` reads paginated resume records back out
7. **Response**: Returns `ResumeOut` with cleaned data and optional AI output, or a paginated resume list for `GET /api/v1/resume/`

## Testing Notes

```bash
poetry run pytest -v
```

Current tests cover health, route versioning, and part of the `/generate` auth path. Additional auth and mocked AI-path tests are still planned.

## Notes

- `clean_text()` now preserves Unicode text via NFC normalization while still stripping some supplementary-plane emoji.
- Education cleaning now emits warnings instead of silently dropping missing-school entries.
- Certification validation rejects invalid issue/expiry ordering when both dates are present.
