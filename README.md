# Resume Builder API

A FastAPI-based REST API that validates, cleans, and AI-enhances resume data for software engineers and technical roles.

## Features

- **Validation & Cleaning**
  - Phone numbers normalized to E.164 format
  - Names cleaned (removes titles like Dr., Prof.)
  - Dates normalized to first-of-month
  - Skills and URLs deduplicated
  - Locations parsed and structured

- **Pydantic Models**
  - `ResumeIn` / `ResumeOut` with strict validation
  - Separate models for Experience, Education, Certification, Location
  - Input models forbid extra fields (`extra="forbid"`)

- **AI-Powered Enhancement**
  - Generates polished, ATS-friendly resumes
  - Anti-hallucination rules prevent fabricated content
  - Outputs clean Markdown format

## Tech Stack

- **Python 3.10+**
- **FastAPI** — REST API framework
- **Pydantic** — Data validation and serialization
- **OpenAI API** — AI-powered resume generation
- **phonenumbers** — Phone validation and E.164 formatting
- **python-dateutil** — Date parsing and normalization
- **Poetry** — Dependency management

## Project Structure

```
resume_builder/
├── main.py                 # FastAPI app entry point
├── config.py               # Environment-based settings
├── models/                 # Pydantic In/Out model pairs
│   ├── resume.py
│   ├── experience.py
│   ├── education.py
│   ├── certification.py
│   └── location.py
├── validations/            # Cleaning functions per model
│   ├── resume.py
│   ├── experience.py
│   ├── education.py
│   ├── certification.py
│   └── location.py
├── utils/                  # Shared utility functions
│   └── utils.py
├── services/               # Business logic
│   ├── validation_service.py
│   ├── ai_service.py
│   └── prompts.py
├── routes/                 # API endpoints
│   └── routes.py
├── tests/                  # Test suite
├── docs/                   # Documentation
└── pyproject.toml          # Poetry dependencies
```

## Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/DJohnson-Code/resume_builder.git
   cd resume_builder
   ```

2. **Install dependencies:**
   ```bash
   poetry install
   ```

3. **Set environment variables:**
   ```bash
   export OPENAI_API_KEY="your-api-key"
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns `{"status": "ok"}`

### Validate & Generate Resume
```
POST /api/v1/resume/validate
Content-Type: application/json
```

**Example request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-123-4567",
  "skills": ["Python", "FastAPI", "PostgreSQL"],
  "location": {
    "country": "USA",
    "state": "CA",
    "city": "San Francisco"
  },
  "experience": [{
    "company": "Acme Corp",
    "position": ["Senior Software Engineer"],
    "start_date": "2022-01-15",
    "description": ["Built REST APIs serving 1M+ requests/day", "Led team of 5 engineers"]
  }],
  "education": [{
    "school": "MIT",
    "degree": "BS Computer Science",
    "start_date": "2016-09-01",
    "graduation_date": "2020-05-15",
    "gpa": 3.8
  }]
}
```

**Response:** `ResumeOut` with cleaned data

### Generate AI Resume
```
POST /api/v1/resume/generate
Content-Type: application/json
```

**Response:** `ResumeOut` with cleaned data and `ai_resume_markdown`

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
- ⚠️ AI service needs OpenAI call implementation
- 🔜 PDF export
- 🔜 Multiple resume templates

## License

MIT
