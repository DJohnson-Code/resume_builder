from __future__ import annotations
from typing import Annotated
from pydantic import BaseModel, EmailStr, HttpUrl, Field

# Import at runtime for field types
from .location import LocationIn, LocationOut
from .experience import ExperienceIn, ExperienceOut
from .education import EducationIn, EducationOut
from .certification import CertificationIn, CertificationOut

PhoneIn = Annotated[
    str,
    Field(
        pattern=r"^\+?\d[\d\s\-()]{9,14}$",
        description="Phone number in various formats",
    ),
]
PhoneOut = Annotated[
    str, Field(pattern=r"^\+\d{10,15}$", description="Phone number in E.164 format")
]


class ResumeIn(BaseModel):
    """
    Raw resume data from the user.

    This is the entry point for user data. Fields may contain:
    - Inconsistent date formats ("Jan 2023", "01/2023", "2023-01")
    - Messy text with extra spaces, inconsistent capitalization
    - Duplicate skills/certifications
    - Unformatted location data

    All fields will be cleaned and normalized by validation functions
    before being converted to the ResumeOut Model.
    """

    name: Annotated[str, Field(min_length=1)]
    email: EmailStr
    phone: PhoneIn
    location: LocationIn | None = None
    urls: list[HttpUrl] | None = None
    experience: list[ExperienceIn] | None = None
    skills: Annotated[list[str], Field(min_length=1)]  # At least 1 skill
    education: list[EducationIn] | None = None
    certifications: list[CertificationIn] | None = None

    # Security: reject any unexpected fields from user input
    model_config = {"extra": "forbid"}


class ResumeOut(BaseModel):
    """
    Clean, validated resume data ready for AI processing or final output.

    This model represents the result of the validation pipeline:
    ResumeIn → Validation Functions → ResumeOut

    All fields are normalized and consistent:
    - Dates in YYYY-MM format
    - Names properly capitalized
    - Skills/certifications deduplicated
    - Phone numbers in E.164 format
    - Locations properly formatted

    This data can be safely sent to AI APIs or used for resume generation.
    """

    # Validation status
    ok: bool  # True if validation succeeded, False if critical errors occurred

    # Cleaned contact information
    cleaned_name: str  # Properly capitalized, titles removed
    cleaned_email: EmailStr  # Validated email format
    cleaned_phone: PhoneOut  # E.164 format (+1234567890)
    cleaned_location: LocationOut | None = None  # Formatted location data

    # Cleaned professional sections
    cleaned_urls: list[HttpUrl] = Field(default_factory=list)  # Validated URLs
    cleaned_experience: list[ExperienceOut] = Field(
        default_factory=list
    )  # Cleaned work history

    cleaned_skills: list[str] = Field(
        default_factory=list
    )  # Deduplicated, cleaned skills

    cleaned_education: list[EducationOut] = Field(
        default_factory=list
    )  # Cleaned education

    cleaned_certifications: list[CertificationOut] = Field(
        default_factory=list
    )  # Deduplicated certifications

    # Non-critical issues found during validation
    warnings: list[str] = Field(
        default_factory=list
    )  # e.g. "No education provided", "Unparseable date"


# Rebuild models after all imports are resolved
ResumeIn.model_rebuild()
ResumeOut.model_rebuild()

