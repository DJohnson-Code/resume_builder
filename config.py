"""
Configuration settings for the resume builder application.
"""

import os
from typing import Optional


class Settings:
    """Application settings and configuration."""

    # API Settings
    API_HOST: str = os.getenv("API_HOST", "127.0.0.1")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Database Settings (if you add a database later)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")

    # File Upload Settings
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx", ".txt"}

    # CORS Settings (for frontend integration)
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]


# Create a global settings instance
settings = Settings()
