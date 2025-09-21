# Resume Builder (Work in Progress)

An AI-powered resume builder app written in Python.  
It collects user input, validates and cleans the data, and formats a structured resume that can be enhanced by OpenAI's API.  
The goal: ensure **consistent, clean, professional input** before sending data to AI, while keeping output flexible.

---

## Features

- **Validation & Cleaning**
  - Normalizes names, locations, dates, skills, certifications
  - Deduplicates skills/certs, enforces date ranges for experiences
  - Location parsing powered by [`pyap`](https://pypi.org/project/pyap/) with fallback cleaning
- **Data Models**
  - `ResumeIn` / `ResumeOut` with structured fields
  - `LocationIn` / `LocationOut` for city/state/country/zip
  - Input models forbid extra fields (`extra="forbid"`) for safety
- **Architecture**
  - Input → Validation/Cleaning → Structured Models → AI API → Resume Output
- **Future Output**
  - Export to `.txt`, `.pdf`, `.json`
  - Multiple resume formats/templates
- **Future AI Enhancements**
  - Bullet point suggestions
  - Grammar/tone improvements
  - Tailoring resumes to job descriptions

---

## Why This Approach?

- **Clean Input**: Validate data before expensive AI calls
- **Consistency**: Same formatting rules across all resumes
- **Cost Efficiency**: AI focuses on content, not basic formatting
- **Flexibility**: AI can enhance content while maintaining structure

---

## Tech Stack

- **Python 3.13**
- **Pydantic** for models/validation
- **pyap** for location parsing
- **dateutil** for date normalization
- **Git + GitHub** for version control
- _(planned)_ FastAPI for a backend API layer
- _(planned)_ OpenAI API for AI-powered resume generation

---

## Project Structure

```
resume_builder/
├── backend/
│   ├── models.py      # Pydantic data models
│   ├── validations.py # Data cleaning/validation functions
│   └── main.py        # API endpoints (planned)
├── frontend/
│   ├── index.html     # Web interface
│   ├── script.js      # Frontend logic
│   └── style.css      # Styling
└── README.md
```

---

## Setup Instructions (WIP)

1. Clone the repo:

   ```bash
   git clone https://github.com/DJohnson-Code/resume_builder.git
   cd resume_builder
   ```

2. Create a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Mac/Linux
   .venv\Scripts\activate      # Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run tests or try a CLI prototype (WIP).
