from __future__ import annotations

from typing import Optional, List
from fastapi import HTTPException
from models import CertificationIn, CertificationOut
from utils import clean_text, first_of_month


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
        issue_date = first_of_month(cert.issue_date) if cert.issue_date else None
        expiry_date = first_of_month(cert.expiry_date) if cert.expiry_date else None
        credential_id = clean_text(cert.credential_id) if cert.credential_id else None
        verification_url = cert.verification_url if cert.verification_url else None

        if not name:
            raise HTTPException(status_code=422, detail="Certification name required.")
        if not issuer:
            raise HTTPException(status_code=422, detail="Certification issuer required.")
        if issue_date and expiry_date and issue_date >= expiry_date: 
            raise HTTPException(status_code=422, detail="Expiration date can not be before issue date.") 
        
        out.append(
            CertificationOut(
                name=name,
                issuer=issuer,
                issue_date=issue_date,
                expiry_date=expiry_date,
                credential_id=credential_id,
                verification_url=verification_url,
            )
        )

    return out

