from __future__ import annotations
from typing import Annotated
from datetime import date
from pydantic import BaseModel, EmailStr, HttpUrl, Field, field_serializer

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
    """

    name: Annotated[str, Field(min_length=1)]
    email: EmailStr
    phone: PhoneIn
    location: LocationIn | None = None

    # Professional information (using type hints - variable_name: data_type)
    urls: list[HttpUrl] | None = None
    experience: list[ExperienceIn] | None = None
    skills: Annotated[list[str], Field(min_length=1)]  # At least 1 skill
    education: list[EducationIn] | None = None
    certifications: list[CertificationIn] | None = None

    # Security: reject any unexpected fields from user input
    model_config = {"extra": "forbid"}


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


class EducationBase(BaseModel):
    """
    Raw education entry as provided in the resume input by the user.
    Graduation dates and GPA may need validation
    """

    school: Annotated[str, Field(min_length=1)]
    degree: str | None = None
    start_date: date
    graduation_date: date | None = None
    gpa: float | None = Field(default=None, ge=0.0, le=4.0)


class EducationIn(EducationBase):
    model_config = {"extra": "forbid"}


class EducationOut(EducationBase):
    start_date: date # Clean date object - first day of month
    graduation_date: date | None = None  # Clean date object - first day of month

    @field_serializer("start_date", "graduation_date")
    def _ym(self, v: date | None, _info) -> str | None:
        return None if v is None else v.strftime("%Y-%m")


class LocationBase(BaseModel):
    """
    Raw location data from user input
    Fields may be inconsistent
    """

    country: Annotated[str, Field(min_length=1)]
    state: Annotated[str, Field(min_length=1)]
    city: Annotated[str, Field(min_length=1)]
    zip: str | None = None


class LocationIn(LocationBase):
    model_config = {"extra": "forbid"}


class LocationOut(LocationBase):
    """
    Cleaned location data.
    All fields should be properly formatted and standardized.
    """


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


ResumeIn.model_rebuild()
ResumeOut.model_rebuild()
