from __future__ import annotations

from typing import Optional, List
from fastapi import HTTPException
from pydantic import HttpUrl
from models import CertificationIn, CertificationOut
from dateutil import parser
from .utils import clean_text


def clean_certifications(
    items: Optional[List[CertificationIn]],
) -> List[CertificationOut]:
    """Clean and validate certification data."""
    if not items:
        return []

    out: List[CertificationOut] = []

    
    for cert in items:
    
        name = clean_text(cert.name)
        issuer = clean_text(cert.issuer)
        credential_id = clean_text(cert.credential_id) if cert.credential_id else None

        if not name: 
            raise HTTPException(status_code=422, detail="Certification name required.")
            
        if not issuer: 
            raise HTTPException(status_code=422, detail="Certification issuer required.")
        
        try: 
            issue_date = parser.parse(str(cert.issue_date)) if cert.issue_date else None
        except ValueError: 
            raise HTTPException(status_code=422, detail="Invalid issue date format.")
        
        try: 
            expiry_date = parser.parse(str(cert.expiry_date)) if cert.expiry_date else None
        except ValueError: 
            raise HTTPException(status_code=422, detail="Invalid expiration date format.")
        
        verification_url = cert.verification_url if cert.verification_url else None

        out.append(
            CertificationOut(
                name=name,
                issuer=issuer,
                credential_id=credential_id,
                issue_date=issue_date,
                expiry_date=expiry_date,
                verification_url=verification_url,
            )
        )

    return out

