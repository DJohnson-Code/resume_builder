---
name: Production Backend Upgrade
overview: Upgrade the Resume Builder API to production-ready status by adding PostgreSQL persistence, JWT authentication, idempotency, rate limiting, structured logging, comprehensive tests, and deployment infrastructure - while preserving the existing validation/normalization architecture.
todos:
  - id: phase1-db
    content: "Phase 1: Add SQLAlchemy models, Alembic migrations, and DB session management"
    status: pending
  - id: phase2-auth
    content: "Phase 2: Implement JWT authentication (register/login endpoints + middleware)"
    status: pending
  - id: phase3-persist
    content: "Phase 3: Refactor POST /validate to persist resumes and generations to DB"
    status: pending
  - id: phase4-idempotency
    content: "Phase 4: Add idempotency key handling for POST requests"
    status: pending
  - id: phase5-pagination
    content: "Phase 5: Implement pagination for list endpoints"
    status: pending
  - id: phase6-rate-limit
    content: "Phase 6: Add rate limiting and structured logging"
    status: pending
  - id: phase7-tests
    content: "Phase 7: Write comprehensive test suite (auth, CRUD, generation, idempotency, pagination)"
    status: pending
  - id: phase8-deploy
    content: "Phase 8: Create Dockerfile, docker-compose, and deployment docs"
    status: pending
isProject: false
---

Production-Ready Backend Upgrade Plan

A) Codebase Assessment

Current Architecture

resume_builder/

├── [main.py](http://main.py)                    # FastAPI app, includes health endpoint

├── [config.py](http://config.py)                  # Settings class (env-based, DATABASE_URL placeholder exists)

├── routes/[routes.py](http://routes.py)           # Single route: POST /api/resume/validate

├── services/

│   ├── ai_[service.py](http://service.py)         # OpenAI client wrapper

│   ├── [prompts.py](http://prompts.py)            # LLM prompt builder

│   └── validation_[service.py](http://service.py) # Orchestrates cleaning functions

├── models/                    # Pydantic In/Out pairs (resume, experience, education, etc.)

├── validations/              # Domain cleaning logic (phone→E.164, name title removal, etc.)

└── utils/                    # Generic helpers (clean_text, clean_date, normalize_url, etc.)

Request Flow (Current)

POST /api/resume/validate receives ResumeIn payload

Pydantic validates structure

clean_and_validate_resume() orchestrates all validations → ResumeOut

If ok=True, calls AIService.generate_resume() (synchronous OpenAI SDK call)

Returns ResumeOut with ai_resume_markdown populated

Patterns Worth Preserving

In/Out Pydantic model pairs - clean separation of raw vs validated data

Validation modules per domain - experience, education, certification cleaners

Reusable utilities - date parsing, URL normalization, text cleaning

Settings class pattern - already has DATABASE_URL placeholder

Current Issues to Address

No persistence - everything is ephemeral

No auth - anyone can call the API

Import-time crash - ai_service = AIService() instantiated at module load

Blocking LLM calls - synchronous OpenAI calls block event loop

print() statements - no structured logging

No tests beyond health check

B) Integration Plan (Phase-by-Phase)

Phase 0: Repo Reconnaissance ✓

Already Complete - Entry point is [main.py](http://main.py), single router in routes/[routes.py](http://routes.py), Pydantic models in models/, validation orchestration in services/validation_[service.py](http://service.py).

Phase 1: Database Foundation

Goal: Add SQLAlchemy + Alembic without breaking existing code.

Files to Create:

db/**init**.py - empty

db/[session.py](http://session.py) - engine, SessionLocal, get_db dependency

db/[base.py](http://base.py) - Base class import hub

db/models/[user.py](http://user.py) - User ORM model

db/models/[resume.py](http://resume.py) - Resume ORM model (stores cleaned data + metadata)

db/models/[generation.py](http://generation.py) - Generation ORM model (LLM call history)

db/models/idempotency_[key.py](http://key.py) - IdempotencyKey ORM model

alembic.ini - Alembic config

alembic/[env.py](http://env.py) - Alembic environment setup

alembic/versions/001_[initial.py](http://initial.py) - Initial migration

Files to Edit:

[config.py](http://config.py) - Add JWT_SECRET, JWT_ALGORITHM, DATABASE_URL validation, rate limit config

Database Schema:

# users table

id: UUID (PK)

email: str (unique, indexed)

hashed_password: str

full_name: str | None

is_active: bool = True

created_at: datetime

updated_at: datetime

# resumes table

id: UUID (PK)

user_id: UUID (FK → [users.id](http://users.id), indexed)

title: str  # User-defined resume title

cleaned_data: JSONB  # Stores ResumeOut.model_dump(mode="json")

created_at: datetime

updated_at: datetime

# generations table

id: UUID (PK)

resume_id: UUID (FK → [resumes.id](http://resumes.id), indexed)

user_id: UUID (FK → [users.id](http://users.id), indexed)

status: enum('pending', 'completed', 'failed')

model_name: str  # e.g., "gpt-4o-mini"

prompt_version: str  # e.g., "v1"

input_hash: str  # hash of input for deduplication

output_markdown: text | None

error_message: text | None

tokens_used: int | None

cost_usd: decimal | None

started_at: datetime

completed_at: datetime | None

created_at: datetime

# idempotency_keys table

id: UUID (PK)

key: str (unique, indexed)

user_id: UUID (FK → [users.id](http://users.id), indexed)

request_hash: str  # hash(method + path + body)

response_status: int

response_body: JSONB

expires_at: datetime (indexed for cleanup)

created_at: datetime

Acceptance Criteria:

poetry add sqlalchemy psycopg2-binary alembic

alembic init alembic generates structure

get_db() dependency yields sessions with proper cleanup

alembic upgrade head creates all tables without errors

Config validates DATABASE_URL is set

Phase 2: Auth (Upgrade-in-Place)

Goal: Add JWT auth without changing existing /validate endpoint behavior initially.

Files to Create:

services/auth_[service.py](http://service.py) - password hashing, JWT encode/decode

routes/[auth.py](http://auth.py) - register, login endpoints

dependencies/[auth.py](http://auth.py) - get_current_user() dependency

Files to Edit:

[main.py](http://main.py) - include auth router

[config.py](http://config.py) - Add JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

New Endpoints:

POST /api/auth/register

  Request: {"email": str, "password": str, "full_name": str}

  Response: {"id": UUID, "email": str}

POST /api/auth/login

  Request: {"email": str, "password": str}

  Response: {"access_token": str, "token_type": "bearer"}

Dependency Pattern:

# dependencies/[auth.py](http://auth.py)

from fastapi import Depends, HTTPException, status

from [fastapi.security](http://fastapi.security) import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session

from services.auth_service import decode_access_token

from db.session import get_db

from db.models.user import User

security = HTTPBearer()

def get_current_user(

```
credentials: HTTPAuthorizationCredentials = Depends(security),

db: Session = Depends(get_db),
```

) -> User:

```
token = credentials.credentials

payload = decode_access_token(token)

user = db.query(User).filter([User.id](http://User.id) == payload["sub"]).first()

if not user or not [user.is](http://user.is)_active:

    raise HTTPException(status_code=401, detail="Invalid credentials")

return user
```

Acceptance Criteria:

Can register new user

Can login and receive JWT

get_current_user() extracts user from valid JWT

Invalid/expired tokens return 401

Phase 3: Persist Core Business Objects

Goal: Modify /api/resume/validate to save resumes + generations to DB.

Files to Create:

repositories/resume_[repository.py](http://repository.py) - CRUD for resumes

repositories/generation_[repository.py](http://repository.py) - CRUD for generations

services/resume_[service.py](http://service.py) - business logic layer

Files to Edit:

routes/[routes.py](http://routes.py):

Add current_user: User = Depends(get_current_user) param

Add db: Session = Depends(get_db) param

Save resume after cleaning via ResumeRepository.create()

Create Generation record with status='pending' before LLM call

Update Generation with result after LLM call

Use dependency injection for AIService (fix import-time instantiation)

Wrap LLM call in run_in_threadpool() to avoid blocking

Minimal Diff for routes/[routes.py](http://routes.py):

from functools import lru_cache

from fastapi import Depends

from fastapi.concurrency import run_in_threadpool

from sqlalchemy.orm import Session

from db.session import get_db

from dependencies.auth import get_current_user

from db.models.user import User

from repositories.resume_repository import ResumeRepository

from repositories.generation_repository import GenerationRepository

@lru_cache

def get_ai_service() -> AIService:

```
return AIService()
```

@[router.post](http://router.post)("/validate", response_model=ResumeOut)

async def validate_resume_route(

```
payload: ResumeIn,

db: Session = Depends(get_db),

current_user: User = Depends(get_current_user),

ai_service: AIService = Depends(get_ai_service),
```

):

```
# 1. Clean and validate (existing logic)

resume_out = clean_and_validate_resume(payload)



# 2. Save resume to DB

resume_repo = ResumeRepository(db)

db_resume = resume_repo.create(

    user_id=current_[user.id](http://user.id),

    title=f"Resume {datetime.utcnow().strftime('%Y-%m-%d')}",

    cleaned_data=resume_out.model_dump(mode="json")

)



if resume_out.ok:

    # 3. Create generation record

    gen_repo = GenerationRepository(db)

    generation = gen_repo.create(

        resume_id=db_[resume.id](http://resume.id),

        user_id=current_[user.id](http://user.id),

        status='pending',

        model_name=settings.OPENAI_MODEL,

        prompt_version='v1'

    )

    

    try:

        # 4. Generate AI content (non-blocking)

        ai_content = await run_in_threadpool(ai_service.generate_resume, resume_out)

        resume_[out.ai](http://out.ai)_resume_markdown = ai_content

        resume_[out.ai](http://out.ai)_model = settings.OPENAI_MODEL

        

        # 5. Update generation as completed

        gen_repo.update_completed([generation.id](http://generation.id), output_markdown=ai_content)

    except Exception as e:

        gen_repo.update_failed([generation.id](http://generation.id), error_message=str(e))

        resume_out.warnings.append(f"AI content generation failed: {e}")



return resume_out
```

New Endpoints:

GET /api/resumes  # List user's resumes (paginated)

GET /api/resumes/{resume_id}  # Get specific resume

DELETE /api/resumes/{resume_id}  # Delete resume (ownership check)

GET /api/resumes/{resume_id}/generations  # List generations for resume

Acceptance Criteria:

Resume saved to DB after cleaning

Generation record created before LLM call

Generation updated with result/error after LLM call

LLM call doesn't block event loop

User can only access their own resumes

Phase 4: Idempotency and Dedupe

Goal: Prevent duplicate LLM calls for identical requests.

Files to Create:

middleware/[idempotency.py](http://idempotency.py) - middleware to handle Idempotency-Key header

repositories/idempotency_[repository.py](http://repository.py) - CRUD for idempotency keys

Implementation Strategy:

# middleware/[idempotency.py](http://idempotency.py)

from fastapi import Request, Response

from hashlib import sha256

import json

async def idempotency_middleware(request: Request, call_next):

```
idempotency_key = request.headers.get("Idempotency-Key")



if idempotency_key and request.method == "POST":

    # Compute request hash

    body = await request.body()

    request_hash = sha256(

        f"{request.method}:{request.url.path}:{body.decode()}".encode()

    ).hexdigest()

    

    # Check if key exists

    repo = IdempotencyRepository(db)

    existing = repo.get_by_key(idempotency_key, user_id=current_[user.id](http://user.id))

    

    if existing:

        if existing.request_hash == request_hash:

            # Same request - return cached response

            return Response(

                content=json.dumps(existing.response_body),

                status_code=existing.response_status,

                media_type="application/json"

            )

        else:

            # Different request - conflict

            return JSONResponse(

                status_code=409,

                content={"detail": "Idempotency key conflict"}

            )

    

    # New request - process and store

    response = await call_next(request)

    # Store response in DB with TTL (24 hours)

    repo.create(idempotency_key, request_hash, response, expires_at=...)

    return response



return await call_next(request)
```

Files to Edit:

[main.py](http://main.py) - add middleware

Acceptance Criteria:

Same Idempotency-Key + same request body → returns cached response (200)

Same Idempotency-Key + different request body → returns 409

Keys expire after 24 hours

Only applies to POST endpoints

Phase 5: Pagination

Goal: Add limit/offset pagination to list endpoints.

Files to Create:

schemas/[pagination.py](http://pagination.py) - Pydantic models for pagination params/response

Pagination Pattern:

# schemas/[pagination.py](http://pagination.py)

from pydantic import BaseModel, Field

class PaginationParams(BaseModel):

```
offset: int = Field(0, ge=0)

limit: int = Field(20, ge=1, le=100)
```

class PaginatedResponse(BaseModel):

```
items: list

total: int

offset: int

limit: int

has_more: bool
```

Files to Edit:

repositories/resume_[repository.py](http://repository.py) - add list_by_user() with pagination

routes/[routes.py](http://routes.py) - add GET /api/resumes with pagination

Minimal Diff:

@router.get("/resumes")

def list_resumes(

```
offset: int = 0,

limit: int = 20,

db: Session = Depends(get_db),

current_user: User = Depends(get_current_user),
```

):

```
repo = ResumeRepository(db)

total = repo.count_by_user(current_[user.id](http://user.id))

resumes = repo.list_by_user(current_[user.id](http://user.id), offset=offset, limit=limit)



return {

    "items": resumes,

    "total": total,

    "offset": offset,

    "limit": limit,

    "has_more": offset + limit < total

}
```

Acceptance Criteria:

GET /api/resumes?offset=0&limit=20 returns paginated results

Response includes total count and has_more flag

Limit capped at 100

Phase 6: Rate Limiting + Logging

Goal: Add per-user rate limiting and structured request logging.

Files to Create:

middleware/rate_[limit.py](http://limit.py) - in-memory rate limiter (production: Redis)

middleware/request_[id.py](http://id.py) - adds request_id to context

utils/[logging.py](http://logging.py) - structured logger setup

Rate Limiter:

# middleware/rate_[limit.py](http://limit.py)

from fastapi import Request, HTTPException

from collections import defaultdict

from datetime import datetime, timedelta

class InMemoryRateLimiter:

```
def **init**(self, requests_per_minute: int = 60):

    self.requests_per_minute = requests_per_minute

    self.requests = defaultdict(list)



def check(self, user_id: str):

    now = datetime.utcnow()

    minute_ago = now - timedelta(minutes=1)

    

    # Clean old requests

    self.requests[user_id] = [

        ts for ts in self.requests[user_id] if ts > minute_ago

    ]

    

    if len(self.requests[user_id]) >= self.requests_per_minute:

        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    

    self.requests[user_id].append(now)
```

rate_limiter = InMemoryRateLimiter()

async def rate_limit_middleware(request: Request, call_next):

```
# Skip auth endpoints

if request.url.path.startswith("/api/auth"):

    return await call_next(request)



user = getattr(request.state, "user", None)

if user:

    rate_limiter.check(str([user.id](http://user.id)))



return await call_next(request)
```

Structured Logging:

# utils/[logging.py](http://logging.py)

import logging

import json

from datetime import datetime

class StructuredLogger:

```
def **init**(self, name: str):

    self.logger = logging.getLogger(name)



def log(self, level: str, message: str, **kwargs):

    log_entry = {

        "timestamp": datetime.utcnow().isoformat(),

        "level": level,

        "message": message,

        **kwargs

    }

    [self.logger.info](http://self.logger.info)(json.dumps(log_entry))
```

Files to Edit:

[main.py](http://main.py) - add middleware

routes/[routes.py](http://routes.py) - replace print() with structured logging

Acceptance Criteria:

Users limited to 60 requests/minute

429 returned when limit exceeded

All logs include request_id and user_id

Logs are JSON-formatted

Phase 7: Tests

Goal: Comprehensive pytest coverage.

Files to Create:

tests/[conftest.py](http://conftest.py) - fixtures (test DB, client, auth tokens)

tests/test_[auth.py](http://auth.py) - register, login, JWT validation

tests/test_resume_[crud.py](http://crud.py) - create, list, get, delete resumes

tests/test_[generation.py](http://generation.py) - LLM generation flow

tests/test_[idempotency.py](http://idempotency.py) - idempotency key behavior

tests/test_[pagination.py](http://pagination.py) - pagination edge cases

tests/test_rate_[limit.py](http://limit.py) - rate limiting

Test DB Setup:

# tests/[conftest.py](http://conftest.py)

import pytest

from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

from db.base import Base

from main import app

from db.session import get_db

TEST_DATABASE_URL = "postgresql://test:[test@localhost:5432](mailto:test@localhost:5432)/test_resume_builder"

@pytest.fixture(scope="session")

def engine():

```
engine = create_engine(TEST_DATABASE_URL)

Base.metadata.create_all(bind=engine)

yield engine

Base.metadata.drop_all(bind=engine)
```

@pytest.fixture

def db_session(engine):

```
Session = sessionmaker(bind=engine)

session = Session()

yield session

session.rollback()

session.close()
```

@pytest.fixture

def client(db_session):

```
def override_get_db():

    yield db_session

app.dependency_overrides[get_db] = override_get_db

from httpx import AsyncClient, ASGITransport

return AsyncClient(transport=ASGITransport(app=app), base_url="[http://test](http://test)")
```

@pytest.fixture

def auth_token(client, db_session):

```
# Register + login

response = [client.post](http://client.post)("/api/auth/register", json={...})

response = [client.post](http://client.post)("/api/auth/login", json={...})

return response.json()["access_token"]
```

Acceptance Criteria:

All tests pass

Coverage >80% on routes/services/repositories

Tests run against isolated test DB

CI-ready (can run in GitHub Actions)

Phase 8: Deployment Readiness

Goal: Dockerize and document deployment.

Files to Create:

Dockerfile - multi-stage build

docker-compose.yml - app + postgres

.env.example - template for env vars

docs/[DEPLOYMENT.md](http://DEPLOYMENT.md) - runbook

Dockerfile:

FROM python:3.10-slim as builder

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock ./

RUN poetry export -f requirements.txt -o requirements.txt --without-hashes

FROM python:3.10-slim

WORKDIR /app

COPY --from=builder /app/requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

docker-compose.yml:

version: '3.8'

services:

  db:

```
image: postgres:15

environment:

  POSTGRES_USER: resume_user

  POSTGRES_PASSWORD: resume_pass

  POSTGRES_DB: resume_builder

volumes:

  - postgres_data:/var/lib/postgresql/data

ports:

  - "5432:5432"
```

  app:

```
build: .

environment:

  DATABASE_URL: postgresql://resume_user:resume_pass@db:5432/resume_builder

  OPENAI_API_KEY: ${OPENAI_API_KEY}

  JWT_SECRET: ${JWT_SECRET}

ports:

  - "8000:8000"

depends_on:

  - db
```

volumes:

  postgres_data:

.env.example:

DATABASE_URL=postgresql://user:[pass@localhost:5432](mailto:pass@localhost:5432)/resume_builder

OPENAI_API_KEY=sk-...

JWT_SECRET=your-secret-key-min-32-chars

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

API_HOST=0.0.0.0

API_PORT=8000

DEBUG=False

Acceptance Criteria:

docker-compose up starts app + DB

alembic upgrade head runs migrations

App serves requests on port 8000

Health check passes

C) Minimal Changes Diff Strategy

Priority 1: Non-Breaking Foundation

Add db/ folder structure - no existing code touched

Add alembic/ migrations - no existing code touched

Update [config.py](http://config.py) to add JWT/DB settings - existing settings preserved

Add new routes in separate routes/[auth.py](http://auth.py) - existing routes unchanged initially

Priority 2: Upgrade Existing Route

Refactor routes/[routes.py](http://routes.py) POST /validate:

Add auth dependency

Add DB session dependency

Change AIService instantiation from module-level to Depends()

Wrap LLM call in run_in_threadpool()

Add repository calls before/after LLM

Total changed lines: ~30 lines

Priority 3: Add Features

Add new GET endpoints for resumes/generations

Add middleware (idempotency, rate limit, request ID)

Add tests

D) Risks & Edge Cases

Long LLM Calls

Risk: OpenAI calls can take 5-30 seconds, blocking the endpoint.

Mitigation: 

Immediate: run_in_threadpool() keeps event loop responsive

Production: Background task queue (Celery + Redis) for async generation

Return status='pending' immediately, poll GET /generations/{id} for result

PII/Security

Risk: Resumes contain sensitive data (names, emails, phone numbers).

Mitigation:

Encrypt cleaned_data JSONB field at rest (PostgreSQL pgcrypto)

Never log resume content - only IDs and metadata

Add GDPR-compliant data export/deletion endpoints

Rate limit aggressively to prevent scraping

Migration from Current State

Risk: No existing data to migrate (currently stateless).

Strategy:

Start fresh with empty DB

Phase 2: If needed, add import endpoint to bulk-load historical data

Cost Control

Risk: LLM calls cost money; abuse could be expensive.

Mitigation:

Rate limiting (60 req/min per user)

Idempotency prevents duplicate charges

Store cost_usd in generations table for monitoring

Add admin endpoint to view per-user costs

Database Connection Pooling

Risk: Each request creating new DB connection is slow.

Mitigation:

SQLAlchemy engine with pool_size=20, max_overflow=10

Use get_db() dependency pattern with proper cleanup

E) Prioritized Checklist (Top 10)

Task

Complexity

Files Affected

Priority

1

Add SQLAlchemy models + Alembic migration

M

db/, alembic/, [config.py](http://config.py)

P0

2

Add auth routes (register/login) + JWT service

M

routes/[auth.py](http://auth.py), services/auth_[service.py](http://service.py), dependencies/[auth.py](http://auth.py)

P0

3

Refactor POST /validate with DB persistence

L

routes/[routes.py](http://routes.py), add repositories

P0

4

Add resume CRUD endpoints (list, get, delete)

M

routes/[routes.py](http://routes.py)

P1

5

Add idempotency middleware

M

middleware/[idempotency.py](http://idempotency.py), [main.py](http://main.py)

P1

6

Add pagination to list endpoints

S

routes/[routes.py](http://routes.py), schemas/[pagination.py](http://pagination.py)

P1

7

Add rate limiting middleware

S

middleware/rate_[limit.py](http://limit.py), [main.py](http://main.py)

P2

8

Replace print() with structured logging

S

All routes, add utils/[logging.py](http://logging.py)

P2

9

Write comprehensive tests

L

tests/ (8 test files)

P2

10

Create Dockerfile + docker-compose

S

Dockerfile, docker-compose.yml, .env.example

P3

Complexity Legend: S = Small (1-2 hours), M = Medium (3-6 hours), L = Large (1-2 days)

Total Estimated Effort: 5-7 days (single developer)

Next Steps

Confirm this plan aligns with your requirements

I'll implement Phase 1 (Database Foundation) first

Each phase will be a separate commit for clean history

Tests will be added incrementally per phase

Note: The old TODO items for writing basic tests are superseded by this comprehensive plan. The new test suite in Phase 7 will cover auth, CRUD, generation, idempotency, and pagination - far beyond the original scope.