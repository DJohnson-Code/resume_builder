# Resume Builder API

FastAPI backend for validating resume payloads and generating ATS-friendly Markdown resumes for technical roles.

## Features

- Validation and normalization for names, phones, dates, locations, URLs, skills, education, experience, and certifications
- Split API flow:
  - `POST /api/v1/resume/validate` for cleaning only
  - `POST /api/v1/resume/generate` for cleaning plus OpenAI-backed resume generation
- App-level API key protection on `/generate` via `X-API-Key`
- OpenAI Responses API integration with prompt rules to avoid hallucinated resume content

## Setup

```bash
poetry install
export OPENAI_API_KEY="your-openai-key"
export APP_API_KEY="your-app-key"
uvicorn main:app --reload
```

`OPENAI_API_KEY` is required for `/api/v1/resume/generate`.
`APP_API_KEY` is required by clients calling `/api/v1/resume/generate` through the `X-API-Key` header.

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

## Testing

```bash
poetry run pytest -v
```

## Status

- Validation pipeline implemented
- OpenAI generation implemented
- API versioning under `/api/v1/resume`
- `/generate` protected by `X-API-Key`

## License

MIT
