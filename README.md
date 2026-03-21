# Resume Builder API

FastAPI backend for validating resume payloads and generating ATS-friendly Markdown resumes for technical roles.

## Purpose

The API accepts structured resume JSON, normalizes and validates it, and can optionally generate a polished Markdown resume using OpenAI.

`README.md` is the quick-start and endpoint guide. Deeper implementation notes live in [docs/README.md](docs/README.md).

## Features

- Validation and normalization for names, phones, dates, locations, URLs, skills, education, experience, and certifications
- Split API flow:
  - `POST /api/v1/resume/validate` for cleaning only
  - `POST /api/v1/resume/generate` for cleaning plus OpenAI-backed resume generation
- App-level API key protection on `/api/v1/resume/*` via `X-API-Key`
- OpenAI Responses API integration with prompt rules to avoid hallucinated resume content

## Stack

- Python 3.10+
- FastAPI
- Pydantic v2
- OpenAI Python SDK
- phonenumbers
- python-dateutil
- Poetry

### Database

A PostgreSQL / SQLAlchemy async database foundation has been added. The project includes ORM models and session management in `db/` (`db/session.py`, `db/models.py`). The database layer is in place; Alembic migrations and persistence wiring are underway.

## Setup

```bash
poetry install
cp .env.example .env
# Edit .env and fill in the required values (see Environment Variables below).
uvicorn main:app --reload
```

## Environment Variables

Copy the template and configure your environment:

- **`DATABASE_URL`** — PostgreSQL connection string for async SQLAlchemy (e.g. `postgresql+asyncpg://user:password@localhost:5432/resumedb`). Required when using the database layer.
- **`OPENAI_API_KEY`** — OpenAI API key; required for `POST /api/v1/resume/generate`.
- **`APP_API_KEY`** — Client API key for authenticating requests to `/api/v1/resume/*`.
- **`DEBUG`** — Set to `true` for debug mode; defaults to `false`.

| Variable | Default | Required | Purpose |
|----------|---------|----------|---------|
| `DATABASE_URL` | none | For DB layer | PostgreSQL async connection string (`postgresql+asyncpg://...`) |
| `OPENAI_API_KEY` | none | For `/generate` | OpenAI access for resume generation |
| `OPENAI_MODEL` | `gpt-4o-mini` | No | Model used by `AIService` |
| `APP_API_KEY` | none | For `/api/v1/resume/*` | Request authentication for clients calling resume endpoints |
| `API_HOST` | `127.0.0.1` | No | App host |
| `API_PORT` | `8000` | No | App port |
| `DEBUG` | `False` | No | Debug toggle |

## API Endpoints

### `GET /api/health`
Returns `{"status": "ok"}`.

### `POST /api/v1/resume/validate`
Accepts a `ResumeIn` payload and returns cleaned `ResumeOut` data.
Requires:
- `APP_API_KEY` configured on the server
- `X-API-Key: <APP_API_KEY>` in the request header

### `POST /api/v1/resume/generate`
Accepts a `ResumeIn` payload, validates it, and returns cleaned `ResumeOut` data with `ai_resume_markdown`.
Requires:
- `OPENAI_API_KEY` configured on the server
- `APP_API_KEY` configured on the server
- `X-API-Key: <APP_API_KEY>` in the request header

### `GET /api/v1/resume/`
Returns a paginated list of persisted resumes.
Requires:
- `APP_API_KEY` configured on the server
- `X-API-Key: <APP_API_KEY>` in the request header

## Example Requests

Validate only:

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/resume/validate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-app-key" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+18165551234",
    "skills": ["Python", "FastAPI"]
  }'
```

List resumes:

```bash
curl "http://127.0.0.1:8000/api/v1/resume/?skip=0&limit=20" \
  -H "X-API-Key: your-app-key"
```

Generate with AI:

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/resume/generate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-app-key" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+18165551234",
    "skills": ["Python", "FastAPI"]
  }'
```

Typical response shape:

```json
{
  "ok": true,
  "cleaned_name": "John Doe",
  "cleaned_email": "john@example.com",
  "cleaned_phone": "+18165551234",
  "cleaned_skills": ["Python", "FastAPI"],
  "warnings": [],
  "ai_resume_markdown": null
}
```

## Testing

```bash
poetry run pytest -v
```

## Status

- **Milestone A (portfolio-grade API):** Core validation pipeline, `/validate` and `/generate` endpoints, and API key protection are in place. Remaining work: expanded test coverage (mocked AI tests, config-edge tests) and final code/docs/test alignment.
- **Milestone B (persistence):** Database foundation added: async SQLAlchemy session (`db/session.py`) and ORM models for resumes and generations (`db/models.py`). `/generate` persistence and an initial paginated resume list route are wired. Next: Alembic migrations, `/validate` persistence if desired, and fuller CRUD/history coverage.
- **Milestone C (production hardening):** Planned (idempotency, rate limiting, observability). Not started.

## License

MIT
