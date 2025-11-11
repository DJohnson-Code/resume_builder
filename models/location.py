from __future__ import annotations
from typing import Annotated
from pydantic import BaseModel, Field


class LocationBase(BaseModel):
    """
    Raw location data from user input
    """

    country: str = Field(min_length=1)
    state: str | None = None
    city: str | None = None
    zip: str | None = None


class LocationIn(LocationBase):
    model_config = {"extra": "forbid"}


class LocationOut(LocationBase):
    """
    Cleaned location data.
    """

