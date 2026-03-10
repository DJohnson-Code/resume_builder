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
- App-level API key protection on `/generate` via `X-API-Key`
- OpenAI Responses API integration with prompt rules to avoid hallucinated resume content

## Stack

- Python 3.10+
- FastAPI
- Pydantic v2
- OpenAI Python SDK
- phonenumbers
- python-dateutil
- Poetry

## Setup

```bash
poetry install
export OPENAI_API_KEY="your-openai-key"
export APP_API_KEY="your-app-key"
uvicorn main:app --reload
```

## Environment Variables

| Variable | Default | Required | Purpose |
|----------|---------|----------|---------|
| `OPENAI_API_KEY` | none | For `/generate` | OpenAI access for resume generation |
| `OPENAI_MODEL` | `gpt-4o-mini` | No | Model used by `AIService` |
| `APP_API_KEY` | none | For `/generate` | Request authentication for clients calling `/generate` |
| `API_HOST` | `127.0.0.1` | No | App host |
| `API_PORT` | `8000` | No | App port |
| `DEBUG` | `False` | No | Debug toggle |
| `DATABASE_URL` | none | No | Reserved for future persistence work |

## API Endpoints

### `GET /api/health`
Returns `{"status": "ok"}`.

### `POST /api/v1/resume/validate`
Accepts a `ResumeIn` payload and returns cleaned `ResumeOut` data. No API key required.

### `POST /api/v1/resume/generate`
Accepts a `ResumeIn` payload, validates it, and returns cleaned `ResumeOut` data with `ai_resume_markdown`.
Requires:
- `OPENAI_API_KEY` configured on the server
- `APP_API_KEY` configured on the server
- `X-API-Key: <APP_API_KEY>` in the request header

## Example Requests

Validate only:

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/resume/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+18165551234",
    "skills": ["Python", "FastAPI"]
  }'
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

- Validation pipeline implemented
- OpenAI generation implemented
- API versioning under `/api/v1/resume`
- `/generate` protected by `X-API-Key`
- Documentation refresh is in progress
- Auth and AI-path test coverage still needs expansion

## License

MIT
