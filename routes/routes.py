from fastapi import APIRouter
from models import ResumeIn, ResumeOut
from services.validation_service import clean_and_validate_resume

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.post("/validate", response_model=ResumeOut)
async def validate_resume_route(payload: ResumeIn):
    """Validate and clean a resume payload."""
    return clean_and_validate_resume(payload)
