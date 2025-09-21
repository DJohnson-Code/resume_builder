from __future__ import annotations
from typing import Optional, Iterable, List
from datetime import datetime
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from models import ResumeIn
import re
import pyap
import unicodedata
from dateutil import parser


def clean_text(s: Optional[str]) -> Optional[str]:
    if s is None:
        return None
    t = " ".join(s.split())
    if not t:
        return None

    # Remove most emoji/symbols in supplementary planes
    t = re.sub(r"[\U00010000-\U0010FFFF]", "", t)
    # Normalize accents: “résumé” -> “resume”
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode("utf-8")

    return t or None


def title_case(s: Optional[str]) -> Optional[str]:

    t = clean_text(s)
    return t.title() if t else t


def clean_email(email: str) -> str:

    t = "".join(email.split())
    return t.lower() if t else t


def resume_warnings(res_warn: ResumeIn):

    warnings = []

    if not res_warn.education:
        warnings.append("No education entries provided.")

    if not res_warn.experience:
        warnings.append("No experience entries provided.")

    if not res_warn.location:
        warnings.append("No location provided.")

    if not res_warn.urls:
        warnings.append("No links or portfolios provided.")

    return warnings


def clean_date(date_cleaned: Optional[str]) -> Optional[str]:
    """
    Normalize various date formats to YYYY-MM format.
    Handles formats like: "2023-01", "January 2023", "01/2023", "Jan 2023", "2023"
    Returns None for invalid dates or special values like "Present", "Current"
    """
    if not date_cleaned:
        return None

    date_cleaned = clean_text(date_cleaned)
    if not date_cleaned:
        return None

    if date_cleaned.lower() in ["present", "current", "ongoing", "now"]:
        return None

    try:
        date_obj = parser.parse(date_cleaned)
        return date_obj.strftime("%Y-%m")
    except Exception:
        return None


def clean_name(name: str) -> str:

    if not name:
        return ""

    cleaned = clean_text(name)
    if not cleaned:
        return ""

    titles = ["mr", "mrs", "ms", "dr", "prof", "professor"]
    words = cleaned.lower().split()

    # Remove titles from the beginning
    while words and words[0] in titles:
        words.pop(0)

    if not words:
        return ""

    # Proper case each word
    return " ".join(word.capitalize() for word in words)


def clean_location(location: str) -> str:
    if not location:
        return ""

    cleaned = clean_text(location)

    if not cleaned:
        return ""

    return pyap.parse(cleaned, country="US")
