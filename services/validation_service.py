from models import ResumeIn, ResumeOut
from validations import (
    clean_name,
    to_e164,
    resume_warnings,
    clean_location,
    clean_experience,
    clean_education,
    clean_certifications,
)
from utils import (
    clean_email,
    clean_urls,
    clean_skills,
)


def clean_and_validate_resume(payload: ResumeIn) -> ResumeOut:
    """
    Single entry point for all resume cleaning and validation.

    Takes a raw ResumeIn payload and returns a fully cleaned ResumeOut.
    """


    cleaned_name = clean_name(payload.name)
    cleaned_email = clean_email(str(payload.email))
    cleaned_phone = to_e164(payload.phone)


    cleaned_location = clean_location(payload.location)
    cleaned_urls = clean_urls(
        [str(url) for url in payload.urls] if payload.urls else []
    )
    cleaned_experience = clean_experience(payload.experience)
    cleaned_education = clean_education(payload.education)
    cleaned_skills = clean_skills(payload.skills)
    cleaned_certifications = clean_certifications(payload.certifications)

    warnings = resume_warnings(payload)

    return ResumeOut(
        ok=True,
        cleaned_name=cleaned_name,
        cleaned_email=cleaned_email,
        cleaned_phone=cleaned_phone,
        cleaned_location=cleaned_location,
        cleaned_urls=cleaned_urls,
        cleaned_experience=cleaned_experience,
        cleaned_education=cleaned_education,
        cleaned_skills=cleaned_skills,
        cleaned_certifications=cleaned_certifications,
        warnings=warnings,
    )