from __future__ import annotations
from typing import Annotated
from datetime import date
from pydantic import BaseModel, Field, field_serializer


class EducationBase(BaseModel):
    """
    Raw education entry as provided in the resume input by the user.
    Graduation dates and GPA may need validation
    """

    school: Annotated[str, Field(min_length=1)]
    degree: str | None = None
    start_date: date | None = None 
    graduation_date: date | None = None
    gpa: float | None = Field(default=None, ge=0.0, le=4.0)


class EducationIn(EducationBase):
    model_config = {"extra": "forbid"}


class EducationOut(EducationBase):
    start_date: date 
    graduation_date: date | None = None  

    @field_serializer("start_date", "graduation_date")
    def _ym(self, v: date | None, _info) -> str | None:
        return None if v is None else v.strftime("%Y-%m")

