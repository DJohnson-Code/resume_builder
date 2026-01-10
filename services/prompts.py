from __future__ import annotations

from datetime import date
from typing import Iterable
from models import ResumeOut

def build_resume_prompt(resume: ResumeOut) -> str: 

    name = resume.cleaned_name
    email = resume.cleaned_email
    phone = resume.cleaned_phone
    location = resume.cleaned_location

    if location: 
        parts = []

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
        urls_block = ""
        for url in urls: 
            urls_block += f"- {url}\n"    
    else:   
        urls_block = "- (none)\n"

    experience = resume.cleaned_experience

    if experience:
        exp_lines = list[str] = []

        for exp in experience: 

        title = exp.position[0] if exp.position else ""
        start = exp.start_date or ""
        end = exp.end_date or "Present"

        header_parts: list[str] = []

           if title:
            header_parts.append(title)

        if exp.company:
            header_parts.append(exp.company)

        dates_part = ""
        if start:
            dates_part = f"{start} – {end}"
        elif exp.end_date:
            dates_part = f"– {end}"

        if dates_part:
            header_parts.append(dates_part)

        if exp.location:
            header_parts.append(exp.location)

        exp_lines.append(f"- " + " | ".join(header_parts))

        for bullet in (exp.description or []):
            exp_lines.append(f"  - {bullet}")

    exp_details = "\n".join(exp_lines) + "\n"
else:
    exp_details = "- (none)\n"


