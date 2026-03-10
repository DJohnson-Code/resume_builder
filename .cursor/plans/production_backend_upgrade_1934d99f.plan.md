---
name: Resume Builder Build Plan
overview: Replace the stale production upgrade plan with an accurate, milestone-phased engineering build plan reflecting current codebase state, completed work, known issues, and the A/B/C roadmap.
todos:
  - id: a1-conftest
    content: Create tests/conftest.py with fixture to control config.settings (APP_API_KEY, OPENAI_API_KEY) for deterministic tests
    status: pending
  - id: a1-fix-auth-test
    content: Fix existing test_generate_auth.py to use conftest fixture, verify deterministic 401
    status: pending
  - id: a1-wrong-key
    content: "Add test: wrong X-API-Key -> 401"
    status: pending
  - id: a1-validate-open
    content: "Add test: /validate with no API key -> 200"
    status: pending
  - id: a1-app-key-unset
    content: "Add test: APP_API_KEY=None -> 503 on /generate"
    status: pending
  - id: a1-openai-unset
    content: "Add test: OPENAI_API_KEY missing -> 503 on /generate"
    status: pending
  - id: a2-mock-success
    content: "Add mocked AI success test: correct key + mock AI -> 200 with ai_resume_markdown"
    status: pending
  - id: a2-mock-failure
    content: "Add mocked AI failure test: mock raises -> 503"
    status: pending
  - id: a3-gpa-bug
    content: Fix GPA truthiness bug in validations/education.py (0.0 treated as None)
    status: pending
  - id: a3-edu-drop
    content: Decide and implement education silent-drop behavior (warn or raise 422)
    status: pending
  - id: a4-unicode
    content: Decide clean_text() Unicode handling and document the decision
    status: pending
  - id: a5-env-example
    content: Create .env.example with all required/optional env vars
    status: pending
  - id: a6-readme
    content: Rewrite README.md to match current codebase
    status: pending
  - id: a6-readme-scope
    content: Clarify the roles of README.md and docs/README.md so they do not overlap
    status: pending
  - id: a7-stale-docs
    content: Clean up or remove stale tests/README.md, scripts/README.md, update docs/README.md
    status: pending
isProject: false
---

# Resume Builder API -- Engineering Build Plan

## 1. Project Snapshot

**Repo:** `/home/hendrix/Projects/resume_builder`
**Stack:** Python 3.10+, FastAPI 0.115, Pydantic v2.9, OpenAI SDK >=2.8, phonenumbers, python-dateutil, Poetry
**Purpose:** Backend-only REST API that accepts raw resume JSON, validates/cleans it, and optionally generates ATS-friendly Markdown via OpenAI.

### Endpoints (current)

- `GET /` -- root greeting
- `GET /api/health` -- health check
- `POST /api/v1/resume/validate` -- clean and validate only, no auth required
- `POST /api/v1/resume/generate` -- validate + AI generation, requires `X-API-Key` header

### Module Layout

```
main.py                        # App entrypoint, .env load, logging, router wiring
config.py                      # Env-backed Settings class (singleton)
routes/routes.py               # API routes, verify_api_key, get_ai_service
services/validation_service.py # Cleaning orchestrator -> ResumeOut
services/ai_service.py         # AsyncOpenAI wrapper
services/prompts.py            # LLM prompt builder from ResumeOut
models/                        # Pydantic In/Out schema pairs
  resume.py, experience.py, education.py, certification.py, location.py
validations/                   # Per-domain cleaning functions
  resume.py, experience.py, education.py, certification.py, location.py
utils/utils.py                 # Shared helpers (clean_text, first_of_month, clean_urls, etc.)
tests/                         # Async endpoint tests (pytest + httpx + ASGITransport)
  test_health.py, test_resume_versioning.py, test_generate_auth.py
```

---

## 2. Architecture Decisions (locked in)

- **Validate/Generate split is intentional.** `/validate` is stateless, free, unauthenticated. `/generate` is protected, billable, and delegates to OpenAI. This separation exists for cost control, security boundaries, and failure isolation. Do not merge them.
- **APP_API_KEY != OPENAI_API_KEY.** `APP_API_KEY` gates client-to-backend access; `OPENAI_API_KEY` gates backend-to-OpenAI calls. They are separate concerns and must stay separate.
- **APP_API_KEY is a portfolio/demo-phase mechanism.** Acceptable now. Real user auth (JWT) belongs in a future milestone when a frontend or public product exists.
- **API versioning** is already in place: router prefix is `/api/v1/resume`.
- **FastAPI dependency injection** is used for both auth (`verify_api_key`) and AI service creation (`get_ai_service` with `@lru_cache`).
- **Internal exceptions are logged, not leaked.** `logger.exception(...)` in the route, generic `503` returned to clients.
- **No `print()` statements** exist in the codebase. Logging uses the `logging` module (currently only one call site in `routes/routes.py`).

---

## 3. Completed Work

- API versioning under `/api/v1/resume`
- App-level API key protection on `/generate` via `verify_api_key` dependency
- Validate/generate responsibility split with separate route handlers
- OpenAI integration implemented (`services/ai_service.py` using `AsyncOpenAI.responses.create`)
- Prompt builder with anti-hallucination rules (`services/prompts.py`)
- Full cleaning pipeline: phone -> E.164, name title removal, date first-of-month, URL dedup, skill dedup, experience/education/certification normalization
- Pydantic In/Out model pairs with `extra="forbid"` on inputs and `YYYY-MM` date serializers on outputs
- Baseline logging config in `main.py`
- Three async endpoint tests: health, versioning, missing-API-key auth

---

## 4. Known Issues and Risks


| ID       | Location                                                         | Issue                                                                                                                                               | Severity         |
| -------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| BUG-1    | [validations/education.py](validations/education.py) line 24     | `education.gpa if education.gpa else None` treats `0.0` as falsy, turning a valid GPA into `None`                                                   | Medium           |
| BUG-2    | [validations/education.py](validations/education.py) lines 26-35 | Entries missing `school` or `start_date` are silently dropped with no warning or error                                                              | Medium           |
| RISK-1   | [utils/utils.py](utils/utils.py) lines 23-25                     | `clean_text()` NFKD-normalizes to ASCII, stripping accents and non-Latin characters. Lossy for names like "Rene" (from "Rene"), schools, and cities | Medium           |
| RISK-2   | [validations/certification.py](validations/certification.py)     | No check that `expiry_date >= issue_date`                                                                                                           | Low              |
| RISK-3   | [tests/test_generate_auth.py](tests/test_generate_auth.py)       | Test expects `401` for missing key, but gets `503` if `APP_API_KEY` is unset in env. Test is environment-sensitive                                  | High (blocks CI) |
| STALE-1  | [README.md](README.md) line 154                                  | Says "AI service needs OpenAI call implementation" -- already implemented                                                                           | Low              |
| STALE-2  | [tests/README.md](tests/README.md)                               | References `test_models.py`, `test_validations.py`, `test_api.py` -- none exist                                                                     | Low              |
| STALE-3  | [scripts/README.md](scripts/README.md)                           | References `setup.sh`, `deploy.sh`, `backup.sh`, `migrate.py` -- none exist                                                                         | Low              |
| UNUSED-1 | [utils/utils.py](utils/utils.py) `clean_date()`                  | Defined but never called in current flow; Pydantic handles date parsing                                                                             | Low              |
| UNUSED-2 | [models/resume.py](models/resume.py) `ai_resume_pdf_url`         | Placeholder field, never populated                                                                                                                  | Low              |


---

## 5. Milestone Roadmap

---

### MILESTONE A -- Portfolio-Grade, Public-Safe API

**Purpose:** Make the project safe to show publicly, coherent to explain, stable to test, and credible as a backend portfolio piece.

#### A.1 -- Deterministic Auth and Config Tests (required)

Make all tests reproducible regardless of host environment by controlling `settings` values inside tests.

- **A.1.1** Create `tests/conftest.py` with a fixture that patches `config.settings` attributes (specifically `APP_API_KEY` and `OPENAI_API_KEY`) so tests do not depend on the host `.env`.
- **A.1.2** Fix existing `test_generate_auth.py` -- set `APP_API_KEY` to a known value in the test fixture, then assert `401` for missing key. This resolves RISK-3.
- **A.1.3** Add test: wrong `X-API-Key` header -> `401`.
- **A.1.4** Add test: `APP_API_KEY` not configured (set to `None`) -> `503`.
- **A.1.5** Add test: `/validate` remains open without any API key -> `200`.
- **A.1.6** Add test: missing `OPENAI_API_KEY` on `/generate` path -> `503` (exercises `get_ai_service` raising).

#### A.2 -- Mocked AI Success Path Test (required)

- **A.2.1** Add test: correct `X-API-Key` + valid payload + mocked `AIService.generate_resume` returning a markdown string -> `200`, response contains `ai_resume_markdown` and `ai_model`. Use `app.dependency_overrides[get_ai_service]` or `unittest.mock.patch` on the `AIService` method. No real OpenAI calls.
- **A.2.2** Add test: correct key + AI raises an exception -> `503` (exercises the `except Exception` branch in `generate_resume_route`).

#### A.3 -- Fix Known Correctness Bugs (required)

- **A.3.1** Fix GPA truthiness bug in [validations/education.py](validations/education.py) line 24. Change to `education.gpa if education.gpa is not None else None`.
- **A.3.2** Decide on silent-drop behavior for education entries: either (a) add a warning to `ResumeOut.warnings` when an entry is dropped, or (b) raise `HTTPException(422)` for missing required fields. Recommended: add a warning and continue, consistent with the rest of the validation layer.

#### A.4 -- Normalization Decision (required -- decide, not necessarily change)

- **A.4.1** Explicitly decide whether `clean_text()` should preserve Unicode or keep the current ASCII transliteration. The current behavior is lossy for accented characters. Options:
  - (a) Keep ASCII-only and document this as an intentional constraint for ATS compatibility.
  - (b) Switch to Unicode-preserving: remove the `.encode("ascii","ignore")` line, keep only emoji stripping and whitespace collapse.
- **A.4.2** Whatever the decision, add a brief comment in `utils/utils.py` documenting the rationale so future contributors do not re-raise the question.

#### A.5 -- `.env.example` (required)

Create `.env.example` at repo root with:

```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
APP_API_KEY=your-app-api-key-here
API_HOST=127.0.0.1
API_PORT=8000
DEBUG=False
DATABASE_URL=
```

#### A.6 -- README Refresh (required)

Rewrite [README.md](README.md) to accurately reflect current state:

- Project purpose and stack
- Architecture: validate vs generate split, why they are separate
- Endpoint reference with methods, paths, auth requirements, and response shapes
- Environment variables table (sourced from `.env.example`)
- Local setup instructions (clone, install, `.env`, run)
- Test execution instructions (`pytest -v`)
- Example curl requests and abbreviated responses for `/validate` and `/generate`
- Current project status (remove the stale "AI service needs implementation" line)
- Clarify that `README.md` is the concise repo overview while [docs/README.md](docs/README.md) holds deeper technical documentation to avoid duplication

#### A.7 -- Documentation Cleanup (required)

- **A.7.1** Rewrite or delete [tests/README.md](tests/README.md) -- remove references to `test_models.py`, `test_validations.py`, `test_api.py`. Replace with the actual test file list and a one-liner on how to run them.
- **A.7.2** Rewrite or delete [scripts/README.md](scripts/README.md) -- remove references to scripts that do not exist. If no scripts exist, delete the file and the empty `scripts/` directory.
- **A.7.3** Update [docs/README.md](docs/README.md) to mention the `APP_API_KEY` requirement on `/generate` and confirm current endpoint paths.

#### A.8 -- Logging Review (required, low effort)

- No `print()` statements exist (verified). Only one `logger.exception()` call in `routes/routes.py`.
- Consider adding `logger.info()` calls at the top of each route handler for request tracing (optional). At minimum, confirm current state is clean and move on.

#### A.9 -- Optional: Readiness Endpoint (nice-to-have)

- Add `GET /api/ready` that checks whether `OPENAI_API_KEY` and `APP_API_KEY` are configured and returns `{"ready": true/false}`. Distinct from `/api/health` which is always-200.
- Not required for Milestone A completion.

#### Milestone A -- Definition of Done

- All existing and new tests pass deterministically with `pytest -v`, regardless of host `.env`.
- Auth behavior is fully covered: missing key, wrong key, correct key, unconfigured server.
- AI success path is tested with mocking.
- GPA truthiness bug is fixed.
- Education silent-drop behavior is either fixed or explicitly documented.
- Unicode normalization decision is made and documented.
- `.env.example` exists.
- README matches the actual codebase.
- Stale docs are cleaned up or removed.
- No `print()` statements in codebase (already true).

---

### MILESTONE B -- Persistence and Real Data Lifecycle

**Purpose:** Move from a stateless request/response transformation API to a stateful backend with stored data and history. This is where the project starts resembling a real product backend.

#### B.1 -- Database Foundation

- Add PostgreSQL via SQLAlchemy (async or sync, decide at implementation time).
- Wire `DATABASE_URL` from `config.py` to engine/session creation.
- Add `db/session.py` with `get_db` dependency.
- Add Alembic for schema migrations.

#### B.2 -- ORM Models

Design stored entities. Likely tables:

- `resumes` -- stores cleaned resume data (JSONB of `ResumeOut.model_dump()`), metadata, timestamps.
- `generations` -- stores each AI generation attempt: resume reference, model name, prompt version, output markdown, status, cost/token metadata, timestamps.
- Relationship: one resume -> many generations.

#### B.3 -- Persistence Integration

- After `/validate` or `/generate` succeeds, persist the cleaned resume and (for `/generate`) the generation record.
- Decide whether persistence is automatic or opt-in (e.g., a `save=true` query param or a separate `POST /api/v1/resume/save` endpoint).

#### B.4 -- CRUD / History Endpoints

- `GET /api/v1/resumes` -- list stored resumes (paginated).
- `GET /api/v1/resumes/{id}` -- get a specific resume.
- `GET /api/v1/resumes/{id}/generations` -- list generation history for a resume.
- `DELETE /api/v1/resumes/{id}` -- delete a resume and its generations.
- Add pagination pattern: `offset`/`limit` query params, response with `items`, `total`, `has_more`.

#### B.5 -- Tests for Persistence

- Test CRUD operations against a test database (SQLite or test PostgreSQL).
- Test pagination edge cases.

#### Milestone B -- Definition of Done

- Resumes and generations are persisted to PostgreSQL.
- Migrations run cleanly via Alembic.
- CRUD endpoints exist and are tested.
- Pagination works on list endpoints.

---

### MILESTONE C -- Reliability, Control, and Production Realism

**Purpose:** Operational discipline for the generation workflow. Not about new features; about making the existing system more resilient and observable.

#### C.1 -- Idempotency for `/generate`

- Accept an `Idempotency-Key` header on `POST /generate`.
- If a key has been seen before with the same request body, return the cached response instead of calling OpenAI again.
- If the same key is sent with a different body, return `409 Conflict`.
- Store idempotency records with a TTL (e.g., 24 hours).
- This prevents duplicate billable generation on retries.

#### C.2 -- Rate Limiting

- Per-client rate limiting on `/generate` (in-memory initially, Redis in production).
- Return `429 Too Many Requests` when exceeded.
- Exempt health/ready endpoints.

#### C.3 -- Observability

- Structured JSON logging (replace basic `logging.basicConfig` with a JSON formatter).
- Log request IDs for tracing.
- Track request counts, latency, and error rates (at minimum via logs; optionally via Prometheus metrics).
- Track generation failures and costs.

#### C.4 -- Error Handling Hardening

- Review all `HTTPException` raises for consistent detail messages.
- Ensure no internal state or stack traces leak in any error response.
- Add input validation for pagination params, path params, and headers.

#### Milestone C -- Definition of Done

- Duplicate `/generate` calls with the same idempotency key do not produce duplicate OpenAI charges.
- Rate limiting is enforced.
- Logs are structured JSON with request IDs.
- Generation success/failure is visible in logs/metrics.

---

### Future / Not In Current Scope

These are intentionally deferred and should not be started before Milestones A-C are complete:

- **JWT / user authentication** -- required when a real frontend or public product exists; replaces `APP_API_KEY`.
- **PDF generation** -- populating `ai_resume_pdf_url` in `ResumeOut`; requires a PDF rendering pipeline.
- **Dockerization** -- `Dockerfile` and `docker-compose.yml` for local and deployment use.
- **CI/CD** -- GitHub Actions for test, lint, type-check on PR.
- **Cloud deployment** -- hosting on a cloud provider.
- **Multiple resume templates** -- different prompt/formatting strategies.
- **SaaS features** -- user accounts, billing, quotas, team workspaces.

---

## 6. Milestone A -- Recommended Execution Order

This is the sequencing for immediate next work:

1. **Create `tests/conftest.py`** with a fixture that sets `config.settings.APP_API_KEY` and `config.settings.OPENAI_API_KEY` to known test values. This unblocks all subsequent test work.
2. **Fix existing `test_generate_auth.py`** to use the fixture. Confirm it passes deterministically.
3. **Add wrong-key test** -- `X-API-Key: wrong-value` -> `401`.
4. **Add validate-open test** -- `POST /validate` with no API key -> `200`.
5. **Add APP_API_KEY-unconfigured test** -- set `APP_API_KEY=None` in fixture, hit `/generate` -> `503`.
6. **Add OPENAI_API_KEY-unconfigured test** -- mock or clear OpenAI key, hit `/generate` -> `503`.
7. **Add mocked AI success test** -- override `get_ai_service` dependency to return a mock, send valid payload with correct key -> `200` with `ai_resume_markdown`.
8. **Add mocked AI failure test** -- mock raises exception -> `503`.
9. **Fix GPA truthiness bug** in `validations/education.py`.
10. **Decide education silent-drop behavior** and implement (add warning or raise 422).
11. **Decide Unicode normalization** for `clean_text()` and document the decision.
12. **Create `.env.example`**.
13. **Rewrite `README.md`**.
14. **Clean up stale docs** (`tests/README.md`, `scripts/README.md`, `docs/README.md`).
