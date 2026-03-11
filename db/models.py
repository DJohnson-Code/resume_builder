from __future__ import annotations


from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, Text, func, ForeignKey, Enum as SQLEnum
import uuid
import enum

class Base(DeclarativeBase):
    pass

class GenerationStatus(str, enum.Enum):
    COMPLETED = "completed"
    FAILED = "failed"

class ResumeRecord(Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4, 
    )

    cleaned_data: Mapped[dict] = mapped_column(JSONB)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

    generations: Mapped[list["GenerationRecord"]] = relationship(
        back_populates="resume",
        cascade="all, delete-orphan",
    )

class GenerationRecord(Base):
    __tablename__ = "generations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    resume_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("resumes.id", ondelete="CASCADE"),
    )

    status: Mapped[GenerationStatus] = mapped_column(
        SQLEnum(GenerationStatus),
        nullable=False,
    )

    markdown_output: Mapped[str | None] = mapped_column(Text, nullable=True)

    ai_model: Mapped[str | None] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )

    resume: Mapped["ResumeRecord"] = relationship(
        back_populates="generations"
    )