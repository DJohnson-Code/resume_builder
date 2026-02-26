import logging
from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException

from config import settings
from models import ResumeIn, ResumeOut
from services.ai_service import AIService
from services.validation_service import clean_and_validate_resume

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@lru_cache
def get_ai_service() -> AIService:
    try:
        return AIService()
    except ValueError:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured",
        )


@router.post("/validate", response_model=ResumeOut)
async def validate_resume_route(payload: ResumeIn) -> ResumeOut:
    return clean_and_validate_resume(payload)


@router.post("/generate", response_model=ResumeOut)
async def generate_resume_route(
    payload: ResumeIn,
    ai_service: AIService = Depends(get_ai_service),
) -> ResumeOut:
    resume_out = clean_and_validate_resume(payload)

    try:
        ai_content = await ai_service.generate_resume(resume_out)
    except Exception:
        logger.exception("AI resume generation failed")
        raise HTTPException(
            status_code=503,
            detail="AI generation failed",
        )

    resume_out.ai_resume_markdown = ai_content
    resume_out.ai_model = settings.OPENAI_MODEL
    return resume_out
