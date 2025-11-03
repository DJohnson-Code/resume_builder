from __future__ import annotations

from models import LocationIn, LocationOut
from .utils import clean_text


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

