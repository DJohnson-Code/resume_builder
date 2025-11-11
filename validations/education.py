from __future__ import annotations

from typing import Optional, List
from models import EducationIn, EducationOut
from utils import title_case, first_of_month


def clean_education(items: Optional[List[EducationIn]]) -> List[EducationOut]:
    if not items:
        return []
    out: List[EducationOut] = []

    for education in items:
        school = title_case(education.school) or ""
        degree = title_case(education.degree) if education.degree else None

        sd = first_of_month(education.start_date) if education.start_date else None
        gd = (
            first_of_month(education.graduation_date)
            if education.graduation_date
            else None
        )

        gpa = education.gpa if education.gpa else None

        if school and sd:
            out.append(
                EducationOut(
                    school=school,
                    degree=degree,
                    start_date=sd,
                    graduation_date=gd,
                    gpa=gpa,
                )
            )

    return out

