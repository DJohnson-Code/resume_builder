from __future__ import annotations
from typing import Annotated
from pydantic import BaseModel, Field


class LocationBase(BaseModel):
    """
    Raw location data from user input
    Fields may be inconsistent
    """

    country: Annotated[str, Field(min_length=1)]
    state: Annotated[str, Field(min_length=1)]
    city: Annotated[str, Field(min_length=1)]
    zip: str | None = None


class LocationIn(LocationBase):
    model_config = {"extra": "forbid"}


class LocationOut(LocationBase):
    """
    Cleaned location data.
    All fields should be properly formatted and standardized.
    """

