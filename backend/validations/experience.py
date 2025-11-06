from __future__ import annotations

from typing import Optional, List
from fastapi import HTTPException
from models import ExperienceIn, ExperienceOut
from .utils import title_case, clean_text, first_of_month


def clean_experience(items: Optional[List[ExperienceIn]]) -> List[ExperienceOut]:
    if not items:
        return []

    out: List[ExperienceOut] = []

    for experience in items:
        company = title_case(experience.company)

        # Process position as a list - clean each item, remove duplicates and blanks
        if isinstance(experience.position, list):
            positions = []
            seen = set()
            for position in experience.position:
                cleaned_position = title_case(position)
                if cleaned_position and cleaned_position.lower() not in seen:
                    seen.add(cleaned_position.lower())
                    positions.append(cleaned_position)
        else:
            # Handle legacy string position
            cleaned_position = title_case(experience.position)
            positions = [cleaned_position] if cleaned_position else []

        sd = first_of_month(experience.start_date) 
        ed = first_of_month(experience.end_date) if experience.start_date else None

        # Process description as a list - clean each item, remove duplicates and blanks
        if isinstance(experience.description, list):
            descriptions = []
            seen = set()
            for desc in experience.description:
                cleaned_desc = clean_text(desc)
                if cleaned_desc and cleaned_desc.lower() not in seen:
                    seen.add(cleaned_desc.lower())
                    descriptions.append(cleaned_desc)
        else:
            # Handle legacy string description
            desc_raw = clean_text(experience.description or "")
            descriptions = [line for line in desc_raw.split("\n") if line.strip()]


        location = title_case(experience.location) or ""

        # Only add if we have minimum required fields
        if not company:
            raise HTTPException(status_code=422, detail="Company required.")
        if not positions:
            raise HTTPException(
                status_code=422, detail="At least one position required."
            )
        if not sd:
            raise HTTPException(status_code=422, detail="Start date required.")

        out.append(
            ExperienceOut(
                company=company,
                position=positions,
                start_date=sd,
                end_date=ed,
                description=descriptions,
                location=location,
            )
        )

    return out

