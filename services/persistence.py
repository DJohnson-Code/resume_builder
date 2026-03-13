from __future__ import annotations

from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from db import ResumeRecord, GenerationRecord, GenerationStatus
from models import ResumeOut


async def create_resume(
    session: AsyncSession, 
    resume_out: ResumeOut
    ) -> ResumeRecord:
    """Storing a cleaned version of resume in the db"""

    resume_record = ResumeRecord(
        cleaned_data=resume_out.model_dump(
            mode="json",
            exclude={"ok", "warnings", "ai_resume_markdown", "ai_resume_pdf_url", "ai_model"},
            exclude_none=True,
    ))

    session.add(resume_record)
    await session.flush()

    return resume_record


async def create_generation(
    session: AsyncSession,
    resume_id: UUID,
    status: GenerationStatus, 
    markdown_output: str | None,  
    ai_model: str | None
    ) -> GenerationRecord:
    """Store an AI generation attempt"""
    generation_record = GenerationRecord(
        resume_id=resume_id,
        status=status, 
        markdown_output=markdown_output,
        ai_model=ai_model
    )

    session.add(generation_record)
    await session.flush()

    return generation_record