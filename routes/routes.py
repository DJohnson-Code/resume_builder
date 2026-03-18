import logging
from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from db import get_db, GenerationStatus
from models import ResumeIn, ResumeOut
from services import AIService, clean_and_validate_resume, create_resume, create_generation

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/resume", tags=["Resume"])


@lru_cache
def get_ai_service() -> AIService:
    try:
        return AIService()
    except ValueError:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured",
        )

async def verify_api_key(x_api_key: str | None = Header(default=None)) -> None:
    if settings.APP_API_KEY is None:
        raise HTTPException(
            status_code=503,
            detail="API key not configured",
        )

    if x_api_key != settings.APP_API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
        )


@router.post("/validate", response_model=ResumeOut)
async def validate_resume_route(
    payload: ResumeIn,
    _: None = Depends(verify_api_key)
    ) -> ResumeOut:
    return clean_and_validate_resume(payload)
    
@router.post("/generate", response_model=ResumeOut)
async def generate_resume_route(
    payload: ResumeIn,
    ai_service: AIService = Depends(get_ai_service),
    _: None = Depends(verify_api_key),
    db: AsyncSession = Depends(get_db)
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

    try: 
        async with db.begin():
            resume_record = await create_resume(db, resume_out)

            await create_generation(
                db, 
                resume_id=resume_record.id,
                status=GenerationStatus.COMPLETED,
                markdown_output=ai_content,
                ai_model=settings.OPENAI_MODEL
            )
    except Exception: 
        logger.exception("Database persistence failed")
        raise HTTPException(
            status_code=503, 
            detail="Database persistence failed",
        )

@router.get("/resumes", response_model=PaginatedResumesResponse)
async def get_resumes(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100), 
    ) -> PaginatedResumesResponse:

    resume_out.ai_resume_markdown = ai_content
    resume_out.ai_model = settings.OPENAI_MODEL
    return resume_out
