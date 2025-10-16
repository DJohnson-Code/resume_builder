Project Context: Resume Builder API
1. Project Overview

Goal: Validate, clean, and normalize resume data so it’s safe and consistent for AI generation or downstream processing. The API takes messy user input (names, dates, skills, URLs, etc.), cleans it, standardizes formats (e.g., dates → YYYY-MM, phone → E.164), and returns a normalized payload. 

main

 

models

 

validations

Core Features:

Health check at GET /api/health. 

main

Resume validation/cleaning at POST /api/resume/validate using robust Pydantic models and cleaning utilities (names, phones, locations, dates, skills, URLs, certifications). 

main

 

models

 

validations

2. Tech Stack

Frameworks: FastAPI (app + OpenAPI docs) 

main

Languages: Python (Pydantic v2 models, validation) 

models

Styling (N/A): No frontend in this repo (API only).

Database: None wired yet; DATABASE_URL is supported for future use. 

config

Package Manager: pip (see requirements.txt). 

requirements

Other Key Libraries/Tools:

pydantic (models/validation), python-dateutil (date parsing), phonenumbers (E.164), email-validator, pyap (addresses), uvicorn (ASGI server), pytest/httpx for tests. 

requirements

3. Project Structure

main.py — FastAPI app, routes (/api/health, /api/resume/validate). 

main

models.py — Pydantic I/O models: ResumeIn, ResumeOut, and related in/out types with serializers (dates → YYYY-MM). 

models

validations.py — Cleaning + normalization (names, emails, E.164 phones, URLs, skills), date parsing, section warnings, field enforcement with HTTPException(422). 

validations

config.py — Settings (host/port/debug, CORS, allowed upload types, optional DB URL). 

config

requirements.txt — Dependencies. 

requirements

__init__.py — Utils package marker. 

__init__

4. Key Commands

Run dev server: uvicorn main:app --reload (FastAPI app object is app in main.py). 

main

 

requirements

API docs: Open http://127.0.0.1:8000/docs after starting the server (FastAPI auto-docs). 

main

Run tests: pytest (pytest + httpx listed). 

requirements

Lint/format: Not defined in repo; skip or propose tools if needed.

5. Coding Conventions

I/O models: Strict input via ResumeIn (extra="forbid"), normalized output via ResumeOut with field serializers for dates. 

models

Validation/Cleaning: Centralized in validations.py (title-casing names, URL normalization, skill dedupe, phone → E.164, robust date parsing to first-of-month). 

validations

Errors: Use HTTPException(status_code=422) for missing/invalid critical fields (e.g., experience, certifications). 

validations

CORS: Preconfigured for local frontends (3000/8080). 

config

6. Current Goals

What I’m working on (short-term):

Harden edge cases in validators (unparseable phones/URLs/dates) and expand warnings coverage. 

validations

Add persistence layer (PostgreSQL) using DATABASE_URL; introduce simple resume storage & retrieval endpoints. 

config

Wire CI/CD (GitHub Actions) and containerize with Uvicorn/Gunicorn for deployment (not yet present; recommended next step).

Specific tasks:

Create /api/resume CRUD (store normalized ResumeOut records).

Add test suite coverage for validations.py (date/phone/url edge cases). 

validations

Expose versioned API and ensure OpenAPI schema stays clean. 

main

7. General Instructions for Gemini

Persona: Act as a senior backend engineer specializing in Python/FastAPI and data validation pipelines.

Tone: Be concise and actionable; when proposing changes, show the minimal diff or exact file/line to edit.

Verification: After any code changes, suggest:

pytest for unit tests (add tests if missing). 

requirements

uvicorn main:app --reload and a sample curl for /api/health and /api/resume/validate. 

main

Proactivity: If you see robustness or security improvements (e.g., stricter URL/phone parsing, more precise error messages, input size limits, rate limiting), propose them explicitly with reasoning and test cases. 

validations

Context sensitivity: Respect existing models/serializers (dates → YYYY-MM, phone → E.164) and don’t regress normalization guarantees. 

models

 

validations

Future-ready: Prefer adding a repository-wide settings toggle via config.py when introducing DB or feature flags (e.g., DATABASE_URL, DEBUG). 

config