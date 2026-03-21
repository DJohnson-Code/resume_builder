from __future__ import annotations
from datetime import datetime
from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, HttpUrl, Field
from sqlalchemy import true


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
    All fields will be cleaned and normalized by validation functions
    before being converted to the ResumeOut Model.
    """

    name: str = Field(min_length=1)
    email: EmailStr
    phone: PhoneIn
    location: LocationIn | None = None
    urls: list[HttpUrl] | None = None
    experience: list[ExperienceIn] | None = None
    skills: Annotated[list[str], Field(min_length=1)]  
    education: list[EducationIn] | None = None
    certifications: list[CertificationIn] | None = None


    model_config = {"extra": "forbid"}


class ResumeOut(BaseModel):
    """
    Clean, validated resume data ready for AI processing or final output.
    """


    ok: bool  # True if validation succeeded, False if critical errors occurred 


    cleaned_name: str  
    cleaned_email: EmailStr 
    cleaned_phone: PhoneOut 
    cleaned_location: LocationOut | None = None 

   
    cleaned_urls: list[HttpUrl] = Field(
        default_factory=list
    )  
    
    cleaned_experience: list[ExperienceOut] = Field(
        default_factory=list
    ) 

    cleaned_skills: list[str] = Field(
        default_factory=list
    )  

    cleaned_education: list[EducationOut] = Field(
        default_factory=list
    ) 

    cleaned_certifications: list[CertificationOut] = Field(
        default_factory=list
    )  

 
    ai_resume_markdown: str | None = None
    ai_resume_pdf_url: HttpUrl | None = None
    ai_model: str | None = None

    warnings: list[str] = Field(
        default_factory=list
    ) 


class ResumeItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


class PaginatedResumesResponse(BaseModel): 
    items: list[ResumeItem]
    total: int
    skip: int
    limit: int
    has_more: bool

ResumeIn.model_rebuild()
ResumeOut.model_rebuild()
