import os
from typing import Optional


class Settings:
    """Application settings and configuration."""

    # API Settings
    API_HOST: str = os.getenv("API_HOST", "127.0.0.1")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Database Settings (when I add the database)
    DATABASE_URL: str | None = os.getenv("DATABASE_URL")

    # File Upload Settings
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx", ".txt"}

    # OpenAI Settings
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # APP KEY ONLY WHILE THIS IS BACKEND ONLY API 
    APP_API_KEY: str | None = os.getenv("APP_API_KEY")

settings = Settings()
