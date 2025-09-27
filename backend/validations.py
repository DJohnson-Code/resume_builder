from __future__ import annotations

from typing import Optional, List
from datetime import datetime, date
from urllib.parse import urlparse, urlunparse
from models import (
    ResumeIn,
    LocationIn,
    LocationOut,
    ExperienceIn,
    ExperienceOut,
    EducationIn,
    EducationOut,
)
import re
import unicodedata
import phonenumbers
from dateutil import parser
from dateutil.parser import ParserError
from phonenumbers import PhoneNumberFormat, NumberParseException


# =============================================================================
# BASE TEXT CLEANING FUNCTIONS
# =============================================================================


def clean_text(s: Optional[str]) -> Optional[str]:
    """
    Remove extra whitespace, accents, and most emoji/supplementary symbols.
    """
    if s is None:
        return None
    t = " ".join(s.split())
    if not t:
        return None

    # Remove most emoji/symbols in supplementary planes
    t = re.sub(r"[\U00010000-\U0010FFFF]", "", t)
    # Normalize accents: "résumé" -> "resume"
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode("utf-8")

    return t or None


def title_case(s: Optional[str]) -> Optional[str]:
    """Clean then Title-Case a string."""
    t = clean_text(s)
    return t.title() if t else t


def clean_email(email: str) -> str:
    """Lowercase + strip spaces."""
    t = "".join(email.split())
    return t.lower() if t else t


def to_e164(raw: str, default_region: str | None = None) -> str | None:
    """
    Convert phone number to E.164 using 'phonenumbers'.
    Returns None if not parseable/valid.
    """
    try:
        n = phonenumbers.parse(raw, default_region)
        if phonenumbers.is_valid_number(n):
            return phonenumbers.format_number(n, PhoneNumberFormat.E164)
        return None
    except NumberParseException:
        return None


# =============================================================================
# WARNING AND VALIDATION FUNCTIONS
# =============================================================================


def resume_warnings(res_warn: ResumeIn) -> list[str]:
    """Non-critical guidance about missing sections."""
    warnings: list[str] = []

    if not res_warn.education:
        warnings.append("No education entries provided.")

    if not res_warn.experience:
        warnings.append("No experience entries provided.")

    if not res_warn.location:
        warnings.append("No location provided.")

    if not res_warn.urls:
        warnings.append("No links or portfolios provided.")

    return warnings


# =============================================================================
# DATE CLEANING FUNCTIONS
# =============================================================================


def clean_date(date_cleaned: Optional[str]) -> Optional[date]:
    """
    Parse many date formats to a date object set to the first of the month.
    Special values ('present', 'current', 'ongoing', 'now') => None.
    """
    if not date_cleaned:
        return None

    date_cleaned = clean_text(date_cleaned)
    if not date_cleaned:
        return None

    if date_cleaned.lower() in ("present", "current", "ongoing", "now"):
        return None

    try:
        dt = parser.parse(
            date_cleaned,
            fuzzy=True,
            dayfirst=False,
            yearfirst=True,
            default=datetime(2000, 1, 1),
        )
        return date(dt.year, dt.month, 1)  # force first of month
    except (ParserError, ValueError):
        return None


# =============================================================================
# NAME AND LOCATION CLEANING FUNCTIONS
# =============================================================================


def clean_name(name: str) -> str:
    """
    Remove titles (Mr, Mrs, Dr, Prof) and proper-case the name.
    """
    if not name:
        return ""

    cleaned = clean_text(name)
    if not cleaned:
        return ""

    titles = {"mr", "mrs", "ms", "dr", "prof", "professor"}
    words = cleaned.lower().split()

    # Remove titles from the beginning
    while words and words[0] in titles:
        words.pop(0)

    if not words:
        return ""

    # Proper case each word
    return " ".join(word.capitalize() for word in words)


def clean_location(location: LocationIn | None) -> LocationOut | None:
    """
    Clean and format location data from LocationIn to LocationOut.
    """
    if not location:
        return None

    # Clean each field
    city = clean_text(location.city) or ""
    state = clean_text(location.state) or ""
    country = clean_text(location.country) or ""
    zip_code = clean_text(location.zip) if location.zip else None

    # Return None if no meaningful location data
    if not any([city, state, country]):
        return None

    return LocationOut(city=city, state=state, country=country, zip=zip_code)


def normalize_url(u: str) -> str | None:
    """
    Return a normalized URL key for dedup/validation or None if invalid.
    - Ensures scheme (defaults to https)
    - Validates netloc exists
    - Lowercases scheme/host
    - Strips trailing slash in path
    """
    if not u.startswith(("http://", "https://")):
        u = f"https://{u}"

    try:
        p = urlparse(u)
    except Exception:
        return None

    if not p.scheme or not p.netloc or "." not in p.netloc:
        return None

    p_norm = p._replace(
        scheme=p.scheme.lower(),
        netloc=p.netloc.lower(),
        path=p.path.rstrip("/"),
    )
    return urlunparse(p_norm)


def clean_urls(urls: list[str]) -> list[str]:
    if not urls:
        return []

    out: list[str] = []
    seen: set[str] = set()

    for raw in urls:
        if not raw:
            continue
        u = clean_text(raw)
        if not u:
            continue

        normalized = normalize_url(u)
        if not normalized or normalized in seen:
            continue

        seen.add(normalized)
        out.append(normalized)  # already a nice display form

    return out


# clean the skills, deduplicate
def clean_skills(skills: list[str]) -> list[str]:

    cleaned: list[str] = []
    seen: set[str] = set()

    for skill in skills:
        if not skill:
            continue

        skill = clean_text(skill)
        if not skill:
            continue

        normalized = skill.lower()
        if normalized in seen:
            continue

        seen.add(normalized)
        cleaned.append(skill)

    return cleaned


def _first_of_month(d: Optional[date]) -> Optional[date]:
    if d is None:
        return None
    return date(d.year, d.month, 1)


def clean_education(items: Optional[List[EducationIn]]) -> List[EducationOut]:
    if not items:
        return []
    out: List[EducationOut] = []

    for education in items:  # use ed consistently
        school = title_case(education.school) or ""
        degree = title_case(education.degree) or ""

        sd = _first_of_month(education.start_date)
        gd = (
            _first_of_month(education.graduation_date)
            if education.graduation_date
            else None
        )

        gpa = education.gpa
        if gpa is not None:
            try:
                g = float(gpa)
                gpa = g if 0.0 <= g <= 4.0 else None
            except Exception:
                gpa = None

        if school and degree and sd:
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
