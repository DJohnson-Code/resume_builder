# Documentation

This directory contains documentation for the Resume Builder API.

## Project Overview

A FastAPI-based REST API that validates, cleans, and AI-enhances resume data for software engineers and technical roles.

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
| `services/` | Business logic (validation orchestration, prompt building, AI service) |
| `routes/` | FastAPI endpoints |

## API Endpoints

### `GET /api/health`
Health check. Returns `{"status": "ok"}`.

### `POST /api/resume/validate`
Accepts raw resume JSON, validates/cleans it, generates AI-enhanced resume.

**Request body**: `ResumeIn` schema
**Response**: `ResumeOut` schema with cleaned data + `ai_resume_markdown`

## Data Flow

1. **Input Validation**: Pydantic validates `ResumeIn` (types, required fields, patterns)
2. **Cleaning**: `clean_and_validate_resume()` normalizes all fields
3. **Prompt Building**: `build_resume_prompt()` formats data for LLM
4. **AI Generation**: `AIService` sends prompt to OpenAI (WIP)
5. **Response**: Returns `ResumeOut` with cleaned data and AI-generated markdown

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | Required for AI generation |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `API_HOST` | `127.0.0.1` | Server host |
| `API_PORT` | `8000` | Server port |

## Running Locally

```bash
# Install dependencies
poetry install

# Set environment variables
export OPENAI_API_KEY="your-key-here"

# Start server
uvicorn main:app --reload
```

## Testing

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v
```

## Status

- ✅ Models and validation complete
- ✅ Prompt builder complete
- ⚠️ AI service incomplete (builds prompt but doesn't call OpenAI yet)
- ⚠️ Route has method name mismatch with AI service
