from __future__ import annotations
from datetime import date
from pydantic import BaseModel, Field, field_serializer


class ExperienceBase(BaseModel):
    """
    Base class for experience entries.
    Inherited by In and Out models.
    """

    company: str = Field(min_length=1)
    position: list[str] = Field(min_length=1)
    start_date: date
    end_date: date | None = None
    description: list[str] = Field(default_factory=list)
    location: str | None = None


class ExperienceIn(ExperienceBase):
    """
    Raw experience entry as it is provided by the user.
    Dates and text may be inconsistent or not entered correctly.
    """

    model_config = {"extra": "forbid"}


class ExperienceOut(ExperienceBase):
    """
    Cleaned version of an experience entry.
    Dates are parsed into proper date objects for validation and formatting.
    Text fields should be whitespace-trimmed and standardized.
    """

    start_date: date  # Clean date object - first day of month
    end_date: date | None = None  # Clean date object - first day of month

    @field_serializer("start_date", "end_date")
    def _ym(self, v: date | None, _info) -> str | None:
        return None if v is None else v.strftime("%Y-%m")

