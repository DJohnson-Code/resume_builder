from __future__ import annotations
from typing import Annotated
from datetime import date
from pydantic import BaseModel, EmailStr, HttpUrl, constr, Field


PhoneIn = Annotated[str, constr(regex=r"^\+?\d[\d\s\-()]{9,14}$")]
PhoneOut = Annotated[str, constr(regex=r"^\+\d{10,15}$")]


class ResumeIn(BaseModel):
    name: str
    email: EmailStr
    phone: PhoneIn
    location: str | None = None
    urls: list[HttpUrl] | None = None
    experience: list[Experience] | None = None
    skills: Annotated[list[str], Field(min_length=1)]
    education: list[Education] | None = None
    certifications: list[str] | None = None
    model_config = {"extra": "forbid"}


class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str | None = None
    description: list[str] = Field(default_factory=list)
    location: str | None = None
    model_config = {"extra": "forbid"}


class Education(BaseModel):
    school: str
    degree: str
    start_date: str
    graduation_date: str
    gpa: float | None = None
    model_config = {"extra": "forbid"}


# Expected resume output
class ResumeOut(BaseModel):
    ok: bool
    normalized_name: str
    normalized_email: EmailStr
    normalized_phone: PhoneOut
    normalized_location: str | None = None

    normalized_urls: list[HttpUrl] = Field(default_factory=list)
    normalized_experience: list[Experience] = Field(default_factory=list)
    normalized_skills: list[str] = Field(default_factory=list)
    normalized_education: list[Education] = Field(default_factory=list)
    normalized_certifications: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
