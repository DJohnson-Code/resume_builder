from __future__ import annotations

from models import ResumeOut


def build_resume_prompt(resume: ResumeOut) -> str:
    name = resume.cleaned_name
    email = resume.cleaned_email
    phone = resume.cleaned_phone
    location = resume.cleaned_location

    if location:
        parts: list[str] = []

        if location.city:
            parts.append(location.city)

        if location.state:
            parts.append(location.state)

        if location.country:
            parts.append(location.country)

        if location.zip:
            parts.append(location.zip)

        location_str = ", ".join(parts)
    else:
        location_str = ""

    urls = resume.cleaned_urls

    if urls:
        urls_block = "\n".join(f"- {url}" for url in urls) + "\n"
    else:
        urls_block = "- (none)\n"

    experience = resume.cleaned_experience

    if experience:
        exp_lines: list[str] = []

        for exp in experience:
            title = exp.position[0] if exp.position else ""
            start = exp.start_date.strftime("%Y-%m")
            end = exp.end_date.strftime("%Y-%m") if exp.end_date else "Present"

            header_parts: list[str] = []

            if title:
                header_parts.append(title)

            if exp.company:
                header_parts.append(exp.company)

            dates_part = f"{start} – {end}"
            header_parts.append(dates_part)

            if exp.location:
                header_parts.append(exp.location)

            exp_lines.append("- " + " | ".join(header_parts))

            for bullet in (exp.description or []):
                exp_lines.append(f"  - {bullet}")

        exp_details = "\n".join(exp_lines) + "\n"
    else:
        exp_details = "- (none)\n"

    education = resume.cleaned_education

    if education: 
        education_lines: list[str] = []

        for edu in education:

            school = edu.school
            degree = edu.degree or ""
            start = edu.start_date.strftime("%Y-%m") if edu.start_date else ""
            grad = edu.graduation_date.strftime("%Y-%m") if edu.graduation_date else ""
            gpa = edu.gpa 

            header_parts: list[str] = []

            if degree: 
                header_parts.append(degree)

            if school:
                header_parts.append(school)

            dates_part = ""
            if start and grad:
                dates_part = f"{start} – {grad}"
            elif start:
                dates_part = f"{start} –"
            elif grad:
                dates_part = f"– {grad}"

            if dates_part:
                header_parts.append(dates_part)

            education_lines.append("- " + " | ".join(header_parts))

            if gpa is not None:
                education_lines.append(f"  - GPA: {edu.gpa:g}")

        education_details = "\n".join(education_lines) + "\n"
    else:
        education_details = "- (none)\n"


    skills = resume.cleaned_skills
    
    if skills: 
        skills_lines = "\n".join(f"- {skill}" for skill in skills) + "\n"
    else: 
        skills_lines = "- (none)\n"

    
    # TODO: certifications sections
    # TODO: Assemble final prompt string and return it
    
    return ""  # Placeholder - needs to be completed