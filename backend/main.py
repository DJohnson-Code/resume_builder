from fastapi import FastAPI
from models import ResumeIn, ResumeOut
from validations import (
    clean_skills,
    clean_name,
    clean_email,
    to_e164,
    resume_warnings,
    clean_location,
    clean_experience,
    clean_education,
    clean_urls,
    clean_certifications,
)

# Initialize the FastAPI app with a title (shows in docs at /docs or /redoc)
app = FastAPI(title="Resume Builder API")


@app.get("/api/health")
def health():
    """
    Health check endpoint.

    Returns:
        dict: A simple status message confirming the API is up and running.
    """
    return {"status": "ok"}


@app.post("/api/resume/validate", response_model=ResumeOut)
def validate_resume(payload: ResumeIn):
    """
    Validate and clean a resume payload.

    Args:
        payload (ResumeIn): Input model containing resume fields,
                            including skills to be validated.

    Returns:
        ResumeOut: A response model with cleaned and validated data.

    Example Request Body:
        {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+15551234567",
            "skills": ["python", " FastAPI ,sql "]
        }

    Example Response:
        {
            "ok": true,
            "cleaned_name": "John Doe",
            "cleaned_email": "john@example.com",
            "cleaned_phone": "+15551234567",
            "cleaned_skills": ["Python", "FastAPI", "SQL"],
            "warnings": []
        }
    """
    # Clean basic fields
    cleaned_name = clean_name(payload.name)
    cleaned_email = clean_email(str(payload.email))

    # Ensure phone is in E.164 format or None
    cleaned_phone = to_e164(payload.phone)
    if not cleaned_phone:
        # If phone can't be parsed, we need to handle this gracefully
        # For now, we'll use the original phone but this should be improved
        cleaned_phone = payload.phone

    # Clean all sections
    cleaned_location = clean_location(payload.location)
    cleaned_urls = clean_urls(
        [str(url) for url in payload.urls] if payload.urls else []
    )
    cleaned_experience = clean_experience(payload.experience)
    cleaned_education = clean_education(payload.education)
    cleaned_skills = clean_skills(payload.skills)
    cleaned_certifications = clean_certifications(payload.certifications)

    # Get warnings
    warnings = resume_warnings(payload)

    # Return response that matches ResumeOut model
    return ResumeOut(
        ok=True,
        cleaned_name=cleaned_name,
        cleaned_email=cleaned_email,
        cleaned_phone=cleaned_phone,
        cleaned_location=cleaned_location,
        cleaned_urls=cleaned_urls,
        cleaned_experience=cleaned_experience,
        cleaned_education=cleaned_education,
        cleaned_skills=cleaned_skills,
        cleaned_certifications=cleaned_certifications,
        warnings=warnings,
    )
