from __future__ import annotations
from datetime import date
from pydantic import BaseModel, HttpUrl, Field, field_serializer


class CertificationBase(BaseModel):
    """
    Parent/Base certification class.
    Inherited by In and Out models.
    """

    name: str = Field(min_length=1)
    issuer: str = Field(min_length=1)
    issue_date: date | None = None
    expiry_date: date | None = None
    credential_id: str | None = None
    verification_url: str | None = None


class CertificationIn(CertificationBase):
    model_config = {"extra": "forbid"}


class CertificationOut(CertificationBase):
    """Clean, validated certification data ready for output or AI processing."""

    issue_date: date
    expiry_date: date | None = None
    verification_url: HttpUrl | None = None  # Enforce valid http/https URL

    @field_serializer("issue_date", "expiry_date")
    def _ym(self, v: date | None, _info) -> str | None:
        return None if v is None else v.strftime("%Y-%m")

