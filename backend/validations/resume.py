from __future__ import annotations

from fastapi import HTTPException
import phonenumbers
from phonenumbers import PhoneNumberFormat, NumberParseException

from models import ResumeIn
from .utils import clean_text, clean_email


def invalid_phone(detail: str = "Invalid phone number."):
    raise HTTPException(status_code=422, detail=detail)


def to_e164(raw: str, region_default: str = "US") -> str:
    """
    Convert raw phone to strict E.164.
    - If input starts with '+', parse without region hint
    - Else parse with region_default (e.g., 'US')
    - On any failure, raise HTTP 422
    """
    s = (raw or "").strip()
    if not s:
        invalid_phone("Phone number is required")
    try:
        # If user provided international format, don't force a region hint
        region = None if s.startswith("+") else region_default
        num = phonenumbers.parse(s, region)
        if not phonenumbers.is_possible_number(num) or not phonenumbers.is_valid_number(
            num
        ):
            invalid_phone("Invalid phone number format")
        return phonenumbers.format_number(num, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException:
        invalid_phone("Invalid phone number format")


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

