from pydantic import BaseModel, EmailStr, HttpUrl, constr


class ResumeIn(BaseModel):
    name: str
    email: EmailStr
    number: constr(regex=r"^\+?\d[\d\s\-()]{9,14}$")
    urls: list[HttpUrl] | None = None
    experience: list[str] | None = None
    skills: list[str]
    education: list[str] | None = None
    

class ResumeOut(BaseModel): 