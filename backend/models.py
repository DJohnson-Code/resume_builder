from __future__ import annotations
from typing import Annotated
from datetime import date
from pydantic import BaseModel, EmailStr, HttpUrl, constr, Field

# PhoneIn - flexible formats for incoming phone numbers:
# - Optional leading "+"
# - Digits, spaces, dashes, parentheses allowed
# - Total length between 10 and 15 characters
PhoneIn = Annotated[str, constr(regex=r"^\+?\d[\d\s\-()]{9,14}$")]

# PhoneOut enforces a normalized E.164-style phone number:
# - Must start with "+"
# - Followed by 10–15 digits only
PhoneOut = Annotated[str, constr(regex=r"^\+\d{10,15}$")]

# ----------------------
# Input Models
# ----------------------


class ResumeIn(BaseModel):
    """
    Represents the raw resume data as received from a user or client input.
    This model allows slightly messy/unstructured fields that will be
    cleaned/normalized (validations file) into ResumeOut.
    """

    name: str
    email: EmailStr
    phone: PhoneIn
    location: str | None = None
    urls: list[HttpUrl] | None = None
    experience: list[ExperienceIn] | None = None
    skills: Annotated[list[str], Field(min_length=1)]
    education: list[EducationIn] | None = None
    certifications: list[str] | None = None

    # Forbid any extra fields not explicitly defined
    model_config = {"extra": "forbid"}


class ExperienceIn(BaseModel):
    """
    Raw experience entry as provided in the resume input.
    Dates and text may be inconsistent or unnormalized.
    """

    company: str
    position: str
    start_date: str
    end_date: str | None = None
    description: list[str] = Field(default_factory=list)
    location: str | None = None

    model_config = {"extra": "forbid"}


class EducationIn(BaseModel):
    """
    Raw education entry as provided in the resume input.
    Graduation dates and GPA may need validation/normalization.
    """

    school: str
    degree: str
    start_date: str
    graduation_date: str
    gpa: float | None = None

    model_config = {"extra": "forbid"}


# ----------------------
# Output Models (cleaned/normalized)
# ----------------------


class ExperienceOut(BaseModel):
    """
    Normalized version of an experience entry.
    Dates should be parsed into a consistent format (e.g., YYYY-MM).
    Text fields should be whitespace-trimmed and standardized.
    """

    company: str
    position: str
    start_date: str
    end_date: str | None = None
    description: list[str] = Field(default_factory=list)
    location: str | None = None

    model_config = {"extra": "forbid"}


class EducationOut(BaseModel):
    """
    Normalized version of an education entry.
    Graduation date should be standardized.
    GPA must fall between 0.0 and 4.0 if provided.
    """

    school: str
    degree: str
    start_date: str
    graduation_date: str | None
    gpa: float | None = Field(default=None, ge=0.0, le=4.0)

    model_config = {"extra": "forbid"}


class ResumeOut(BaseModel):
    """
    The cleaned and validated resume object returned by the system.
    All fields should be normalized into predictable formats.
    """

    ok: bool  # Indicates whether normalization/validation succeeded

    # Contact info
    cleaned_name: str
    cleaned_email: EmailStr
    cleaned_phone: PhoneOut
    cleaned_location: str | None = None

    # Structured sections
    cleaned_urls: list[HttpUrl] = Field(default_factory=list)
    cleaned_experience: list[ExperienceOut] = Field(default_factory=list)
    cleaned_skills: list[str] = Field(default_factory=list)
    cleaned_education: list[EducationOut] = Field(default_factory=list)
    cleaned_certifications: list[str] = Field(default_factory=list)

    # Warnings hold non-critical issues (e.g., unparseable dates, unknown skills)
    warnings: list[str] = Field(default_factory=list)