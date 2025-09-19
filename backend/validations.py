from __future__ import annotations
from typing import Optional, Iterable, List
from datetime import datetime
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
import re
import unicodedata


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
    """
    Conservative Title-Case for names/companies/locations.
    (You can later add exceptions like “McDonald”, “van”, “KC, MO”, etc.)
    """

    t = clean_text(s)
    return t.title() if t else t


def clean_email(email: str) -> str:

    t = "".join(email.split())
    return t.lower() if t else t
