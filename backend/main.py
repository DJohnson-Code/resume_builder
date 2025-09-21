from fastapi import FastAPI
from models import ResumeIn, ResumeOut
from validations import split_skills

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
        ResumeOut: A response model indicating the operation result, 
                   with normalized skill list.

    Example Request Body:
        {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": {
                "country_code": "+1",
                "number": "5551234567"
            },
            "skills": ["python", " FastAPI ,sql "]
        }

    Example Response:
        {
            "ok": true,
            "cleaned_skills": ["Python", "FastAPI", "SQL"]
        }
    """
    # Normalize skills using helper function
    skills = split_skills(payload.skills)

    # Return response that matches ResumeOut model
    return {"ok": True, "cleaned_skills": skills}
