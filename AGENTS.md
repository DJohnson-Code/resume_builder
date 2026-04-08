# AGENTS.md

## Project Purpose
Resume Builder API is a FastAPI backend that:
1. accepts structured resume JSON,
2. cleans and normalizes the data,
3. optionally generates ATS-friendly markdown via OpenAI,
4. persists cleaned resumes and generation metadata in PostgreSQL.

This is a portfolio-grade backend project. Prefer production-minded changes over quick hacks.

## Working Style
- For non-trivial changes, plan first before editing.
- Prefer explanation, review, and guided implementation over writing large amounts of code at once.
- Prefer small, minimal diffs.
- Preserve existing architecture boundaries.
- When changing behavior, update or add tests.
- Prefer targeted tests first for small changes, then broader verification if needed.
- Do not guess library behavior when unsure; check docs/examples first.
- Do not read `.env` or other secret files. Use `.env.example` for variable names only.

## Setup
- Install dependencies with `poetry install --no-root`.
- Copy `.env.example` to `.env` for local runs.
- Main env vars: `DATABASE_URL`, `APP_API_KEY`, `OPENAI_API_KEY`, `OPENAI_MODEL`.
- `db/session.py` raises at import time if `DATABASE_URL` is unset, so the app currently cannot be imported without a DB URL.

## Run
- Start the API with:
  - `poetry run uvicorn main:app --reload`

## Database / Migrations
- Apply migrations with:
  - `poetry run alembic upgrade head`

## Verify
- Prefer targeted tests first:
  - `poetry run pytest tests/<file>.py -v`
- Full test suite:
  - `poetry run pytest -v`

## Entry Points
- App entrypoint: `main.py`
- Main router: `routes/routes.py`

## API Surface
- `GET /api/health`
- `GET /`
- `POST /api/v1/resume/validate`
- `POST /api/v1/resume/generate`
- `GET /api/v1/resume/`

## Auth Rules
- All `/api/v1/resume/*` routes require `X-API-Key` matching `APP_API_KEY`.
- Do not assume `/validate` is public.

## Architecture
- `routes/`: HTTP layer only; request/response orchestration
- `services/`: orchestration, AI generation, persistence helpers
- `validations/`: cleaning and validation logic
- `utils/`: shared normalization helpers
- `models/`: Pydantic request/response schemas
- `db/`: async SQLAlchemy session + ORM models
- `alembic/`: migrations

## Service Boundary Rules
- Keep route handlers thin.
- Do not move business logic into routes.
- Keep validation logic in `validations/` and orchestration in `services/`.
- Keep persistence logic in `services/` and `db/`, not embedded directly into route handlers.
- Preserve current response models unless intentionally changing the API contract.
- `ResumeItem` for list responses is intentionally minimal: `id`, `created_at`, `updated_at`.

## Known Issues
- `tests/test_resume_versioning.py` is outdated: it expects `/validate` without auth, but the route now requires `X-API-Key`.
- Test coverage is still thin for successful generate flow, pagination, DB failure paths, and validation edge cases.
- `/generate` currently performs AI generation before DB persistence; if DB persistence fails afterward, the request returns 503 and the generated markdown is not returned.

## Notes for AI Agents
- Trust on-disk code over README when they conflict.
- Prefer inspecting `routes/routes.py`, `services/validation_service.py`, `services/persistence_service.py`, `services/ai_service.py`, and `models/resume.py` first for core behavior.
- If making API behavior changes, inspect tests before editing.
- If making DB changes, inspect current Alembic migration and ORM models before editing.

## Docs and External Examples
- When you need official or version-sensitive API information, use `context7`.
- When you need real-world implementation patterns, use `gh_grep` to search public GitHub code examples.
- Treat GitHub examples as patterns, not truth.
- Cross-check external examples against current docs when the API is version-sensitive.
- Always adapt external examples to this repo’s current architecture, conventions, and constraints.
- Prefer this repo’s on-disk code and architecture over external examples when they conflict.