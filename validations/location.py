from __future__ import annotations

from models import LocationIn, LocationOut
from typing import List
from utils import clean_text


def clean_location(location: LocationIn | None) -> LocationOut | None:
    """
    Clean and format location data from LocationIn to LocationOut.
    """
    if not location:
        return None
    

 
    country = clean_text(location.country) or ""
    state = clean_text(location.state) if location.state else None
    city = clean_text(location.city) if location.city else None
    zip = clean_text(location.zip) if location.zip else None

   
    return LocationOut(
            country=country,
            state=state,
            city=city,
            zip=zip,
    )

