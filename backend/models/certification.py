from __future__ import annotations
from pydantic import BaseModel, HttpUrl, Field, field_serializer


class CertificationBase(BaseModel):
    """
    Parent/Base certification class.
    Inherited by In and Out models.
    """

    name: str = Field(min_length=1)
    issuer: str = Field(min_length=1)
    issue_date: str | None = None
    expiry_date: str | None = None
    credential_id: str | None = None
    verification_url: HttpUrl | None = None  # Enforce valid http/https URL


class CertificationIn(CertificationBase):
    model_config = {"extra": "forbid"}


class CertificationOut(CertificationBase):
    """Clean, validated certification data ready for output or AI processing."""

