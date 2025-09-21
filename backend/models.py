from __future__ import annotations
from typing import Annotated
from datetime import date
from pydantic import BaseModel, EmailStr, HttpUrl, Field, field_serializer

PhoneIn = Annotated[str, Field(pattern=r"^\+?\d[\d\s\-()]{9,14}$")]
PhoneOut = Annotated[str, Field(pattern=r"^\+\d{10,15}$")]


class ResumeIn(BaseModel):
    """
    Raw resume data from user input - accepts messy, inconsistent formats.

    This is the entry point for user data. Fields may contain:
    - Inconsistent date formats ("Jan 2023", "01/2023", "2023-01")
    - Messy text with extra spaces, inconsistent capitalization
    - Duplicate skills/certifications
    - Unformatted location data

    All fields will be cleaned and normalized by validation functions
    before being converted to ResumeOut.
    """

    # Basic contact information (using type hints - variable_name: data_type)
    name: str
    email: EmailStr
    phone: PhoneIn
    location: LocationIn | None = None

    # Professional information (using type hints - variable_name: data_type)
    urls: list[HttpUrl] | None = None  #
    experience: list[ExperienceIn] | None = None
    skills: Annotated[list[str], Field(min_length=1)]  # At least 1 skill
    education: list[EducationIn] | None = None
    certifications: list[str] | None = None

    # Security: reject any unexpected fields from user input
    model_config = {"extra": "forbid"}


class ExperienceIn(BaseModel):
    """
    Raw experience entry as provided in the resume input.
    Dates and text may be inconsistent or uncleaned.
    """

    company: str
    position: str
    start_date: str  # Raw string input - will be converted to date
    end_date: str | None = None  # Raw string input - will be converted to date
    description: list[str] = Field(default_factory=list)
    location: str | None = None

    model_config = {"extra": "forbid"}


class EducationIn(BaseModel):
    """
    Raw education entry as provided in the resume input.
    Graduation dates and GPA may need validation/cleaning.
    """

    school: str
    degree: str
    start_date: str  # Raw string input - will be converted to date
    graduation_date: str  # Raw string input - will be converted to date
    gpa: float | None = None

    model_config = {"extra": "forbid"}


class LocationIn(BaseModel):
    """
    Raw location data from user input.
    Fields may be inconsistent or unclean.
    """

    city: str
    state: str
    country: str
    zip: str | None = None

    model_config = {"extra": "forbid"}


# =============================================================================
# OUTPUT MODELS - Clean, normalized data ready for AI processing
# =============================================================================
# These models represent data after validation and cleaning
# No extra field restrictions (allows AI to add fields)


class ExperienceOut(BaseModel):
    """
    Cleaned version of an experience entry.
    Dates are parsed into proper date objects for validation and formatting.
    Text fields should be whitespace-trimmed and standardized.
    """

    company: str
    position: str
    start_date: date  # Clean date object - first day of month
    end_date: date | None = None  # Clean date object - first day of month
    description: list[str] = Field(default_factory=list)
    location: str | None = None

    @field_serializer("start_date", "end_date")
    def _ym(self, v: date | None, _info):
        return None if v is None else v.strftime("%Y-%m")


class EducationOut(BaseModel):
    """
    Cleaned version of an education entry.
    Graduation date is parsed into proper date object.
    GPA must fall between 0.0 and 4.0 if provided.
    """

    school: str
    degree: str
    start_date: date  # Clean date object - first day of month
    graduation_date: date | None  # Clean date object - first day of month
    gpa: float | None = Field(default=None, ge=0.0, le=4.0)

    @field_serializer("start_date", "graduation_date")
    def _ym(self, v: date | None, _info):
        return None if v is None else v.strftime("%Y-%m")


class LocationOut(BaseModel):
    """
    Cleaned location data.
    All fields should be properly formatted and standardized.
    """

    city: str
    state: str
    country: str
    zip: str | None = None


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

    cleaned_certifications: list[str] = Field(
        default_factory=list
    )  # Deduplicated certifications

    # Non-critical issues found during validation
    warnings: list[str] = Field(
        default_factory=list
    )  # e.g., "No education provided", "Unparseable date"
