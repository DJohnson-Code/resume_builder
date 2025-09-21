from __future__ import annotations
from typing import Optional, Iterable, List
from datetime import datetime
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from models import ResumeIn
import re
import pyap
import unicodedata
from dateutil import parser


# =============================================================================
# BASE TEXT CLEANING FUNCTIONS
# =============================================================================


def clean_text(s: Optional[str]) -> Optional[str]:
    """
    Base text cleaning function - removes whitespace, accents, and emoji.

    This is the foundation for all other cleaning functions.

    Args:
        s: Raw text string (may be None)

    Returns:
        Cleaned text or None if input was empty/invalid

    Examples:
        "  John   Doe  " -> "John Doe"
        "résumé" -> "resume"
        "Hello 👋 World" -> "Hello World"
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
    """
    Convert text to title case after cleaning.

    Args:
        s: Raw text string

    Returns:
        Title-cased text or None if input was empty

    Examples:
        "john doe" -> "John Doe"
        "MICROSOFT CORPORATION" -> "Microsoft Corporation"
    """
    t = clean_text(s)
    return t.title() if t else t


def clean_email(email: str) -> str:
    """
    Clean and normalize email addresses.

    Args:
        email: Raw email string

    Returns:
        Lowercase email with whitespace removed

    Examples:
        "John.Doe@GMAIL.COM " -> "john.doe@gmail.com"
    """
    t = "".join(email.split())
    return t.lower() if t else t


# =============================================================================
# WARNING AND VALIDATION FUNCTIONS
# =============================================================================


def resume_warnings(res_warn: ResumeIn) -> list[str]:
    """
    Generate non-critical warnings about missing resume sections.

    These warnings help users understand what might be missing from their resume
    but don't prevent the resume from being processed.

    Args:
        res_warn: ResumeIn object to check for missing sections

    Returns:
        List of warning messages

    Examples:
        ["No education entries provided.", "No links or portfolios provided."]
    """
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


# =============================================================================
# DATE CLEANING FUNCTIONS
# =============================================================================


def clean_date(date_cleaned: Optional[str]) -> Optional[str]:
    """
    Normalize various date formats to YYYY-MM format.

    Handles flexible date inputs and converts them to consistent format.
    Special values like "Present" return None (for ongoing positions).

    Args:
        date_cleaned: Raw date string in various formats

    Returns:
        Normalized date in YYYY-MM format or None for invalid/special dates

    Examples:
        "January 2023" -> "2023-01"
        "01/2023" -> "2023-01"
        "2023" -> "2023-01"
        "Present" -> None
        "Invalid date" -> None
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


# =============================================================================
# NAME AND LOCATION CLEANING FUNCTIONS
# =============================================================================


def clean_name(name: str) -> str:
    """
    Clean and normalize person names.

    Removes titles (Mr, Mrs, Dr, etc.) and applies proper capitalization.
    Handles common name formatting issues.

    Args:
        name: Raw name string (may include titles)

    Returns:
        Cleaned name with proper capitalization

    Examples:
        "dr. john doe" -> "John Doe"
        "MRS. JANE SMITH" -> "Jane Smith"
        "professor mike johnson" -> "Mike Johnson"
    """
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
    """
    Parse and format location using pyap address parsing.

    Uses pyap library to extract city, state, country from raw location text.
    Falls back to title case if parsing fails.

    Args:
        location: Raw location string (address, city/state, etc.)

    Returns:
        Formatted location string

    Examples:
        "123 Main St Houston Texas" -> "Houston, TX"
        "London UK" -> "London, UK"
        "just a city" -> "Just A City" (fallback)
    """
    if not location:
        return ""

    cleaned = clean_text(location)
    if not cleaned:
        return ""

    try:
        # Parse the address using pyap
        addresses = pyap.parse(cleaned, country="US")

        if addresses:
            addr = addresses[0]  # Take the first (most likely) address

            # Extract components
            city = addr.city or ""
            state = addr.state or ""
            country = addr.country or ""

            # Format the result
            if city and state:
                return f"{city}, {state}"
            elif city and country:
                return f"{city}, {country}"
            elif city:
                return city
            else:
                # Fallback to title case
                return cleaned.title()
        else:
            # No address found, fallback to title case
            return cleaned.title()

    except Exception:
        # If pyap fails, fallback to title case
        return cleaned.title()
