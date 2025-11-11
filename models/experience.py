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
    """

    model_config = {"extra": "forbid"}


class ExperienceOut(ExperienceBase):
    """
    Cleaned version of an experience entry.
    """

    start_date: date  # Clean date object - first day of month
    end_date: date | None = None  # Clean date object - first day of month

    @field_serializer("start_date", "end_date")
    def _ym(self, v: date | None, _info) -> str | None:
        return None if v is None else v.strftime("%Y-%m")

