from functools import lru_cache
from fastapi import APIRouter, Depends
from models import ResumeIn, ResumeOut
from services.validation_service import clean_and_validate_resume
from services.ai_service import AIService
from config import settings

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@lru_cache
def get_ai_service() -> AIService:
    return AIService()

@router.post("/validate", response_model=ResumeOut)
async def validate_resume_route(
    payload: ResumeIn,
    ai_service: AIService = Depends(get_ai_service)
    ):
    """Validate and clean a resume payload."""
    resume_out = clean_and_validate_resume(payload)

    if resume_out.ok:
        try:
            ai_content = await ai_service.generate_resume(resume_out)
            resume_out.ai_resume_markdown = ai_content
            resume_out.ai_model = settings.OPENAI_MODEL
        except Exception as e:
            # Log the error for debugging purposes
            print(f"Error generating AI content: {e}")
            resume_out.warnings.append(f"AI content generation failed: {e}")
            # Optionally, you could raise an HTTPException here if AI content is critical
            # raise HTTPException(status_code=500, detail="AI content generation failed")
            
    return resume_out
