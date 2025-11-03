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
        company = title_case(experience.company) or ""

        # Process position as a list - clean each item, remove duplicates and blanks
        if isinstance(experience.position, list):
            positions = []
            seen = set()
            for pos in experience.position:
                cleaned_pos = title_case(pos)
                if cleaned_pos and cleaned_pos.lower() not in seen:
                    seen.add(cleaned_pos.lower())
                    positions.append(cleaned_pos)
        else:
            # Handle legacy string position
            cleaned_pos = title_case(experience.position)
            positions = [cleaned_pos] if cleaned_pos else []

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

        start_date = first_of_month(experience.start_date)
        end_date = first_of_month(experience.end_date) if experience.end_date else None
        location = title_case(experience.location) or ""

        # Only add if we have minimum required fields
        if not company:
            raise HTTPException(status_code=422, detail="Company required.")
        if not positions:
            raise HTTPException(
                status_code=422, detail="At least one position required."
            )
        if not start_date:
            raise HTTPException(status_code=422, detail="Start date required.")

        out.append(
            ExperienceOut(
                company=company,
                position=positions,
                start_date=start_date,
                end_date=end_date,
                description=descriptions,
                location=location,
            )
        )

    return out

