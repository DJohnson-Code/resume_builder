from pydantic import BaseModel, EmailStr, HttpUrl, constr, Field
from typing import Annotated

Phone = Annotated[str, constr(regex=r"^\+?\d[\d\s\-()]{9,14}$")]


class ResumeIn(BaseModel):
    name: str
    email: EmailStr
    phone: Phone
    urls: list[HttpUrl] | None = None
    experience: list[str] | None = None
    skills: Annotated[list[str], Field(min_lenght=1)]
    education: list[str] | None = None


class ResumeOut(BaseModel):
    ok: bool
    normalized_skills: list[str]
    normalized_urls: list[HttpUrl] | None = None
    warnings: list[str] | None = None
