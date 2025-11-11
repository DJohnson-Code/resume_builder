from __future__ import annotations

from typing import Optional
from datetime import datetime, date
from urllib.parse import urlparse, urlunparse
import re
import unicodedata
from dateutil import parser
from dateutil.parser import ParserError



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
        return date(dt.year, dt.month, 1)  
    except (ParserError, ValueError):
        return None


def first_of_month(d: Optional[date]) -> Optional[date]:
    if d is None:
        return None
    return date(d.year, d.month, 1)


def normalize_url(u: str) -> str | None:
    """
    Return a normalized URL key for dedup/validation or None if invalid.
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
        out.append(normalized) 

    return out



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

