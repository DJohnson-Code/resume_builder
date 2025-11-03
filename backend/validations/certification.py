from __future__ import annotations

from typing import Optional, List
from fastapi import HTTPException
from models import CertificationIn, CertificationOut
from .utils import clean_text


def clean_certifications(
    items: Optional[List[CertificationIn]],
) -> List[CertificationOut]:
    """Clean and validate certification data."""
    if not items:
        return []

    out: List[CertificationOut] = []

    for cert in items:
        name = clean_text(cert.name) or ""
        issuer = clean_text(cert.issuer) or ""
        credential_id = clean_text(cert.credential_id) if cert.credential_id else None
        verification_url = (
            clean_text(cert.verification_url) if cert.verification_url else None
        )

        # Validate required fields
        if not name:
            raise HTTPException(status_code=422, detail="Certification name required.")
        if not issuer:
            raise HTTPException(
                status_code=422, detail="Certification issuer required."
            )
        if not cert.issue_date:
            raise HTTPException(
                status_code=422, detail="Certification issue date required."
            )

        out.append(
            CertificationOut(
                name=name,
                issuer=issuer,
                issue_date=cert.issue_date,
                expiry_date=cert.expiry_date,
                credential_id=credential_id,
                verification_url=verification_url,
            )
        )

    return out

