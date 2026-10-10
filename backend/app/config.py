from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


_DEV_SECRET = "dev-only-insecure-secret-change-me"


class Settings(BaseSettings):
    """Application settings loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = Field(default="test-site", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=True, alias="DEBUG")

    # Stored as a raw comma-separated string so pydantic-settings does not
    # try to JSON-decode it (list[str] fields are treated as "complex" and
    # require JSON in .env, which is hostile to humans).
    cors_origins_raw: str = Field(
        default="http://localhost:5173",
        alias="CORS_ORIGINS",
    )

    database_url: str = Field(
        default="sqlite:///./data/app.db",
        alias="DATABASE_URL",
    )

    # Signs the admin session cookie. MUST be a long random value in production.
    secret_key: str = Field(default=_DEV_SECRET, alias="SECRET_KEY")
    session_hours: int = Field(default=12, alias="SESSION_HOURS")

    # Uploaded images. Point this at persistent storage in production.
    upload_dir: str = Field(default="uploads", alias="UPLOAD_DIR")
    max_upload_mb: int = Field(default=5, alias="MAX_UPLOAD_MB")

    # Folder with the built frontend (vite build output). When it exists, the API
    # also serves the website, so one service hosts everything on one domain.
    static_dir: str = Field(default="static", alias="STATIC_DIR")

    @model_validator(mode="after")
    def _require_real_secret_in_production(self) -> "Settings":
        if self.app_env == "production" and (
            self.secret_key == _DEV_SECRET or len(self.secret_key) < 32
        ):
            raise ValueError(
                "SECRET_KEY must be set to a random value of 32+ characters in production"
            )
        return self

    @property
    def cors_origins(self) -> list[str]:
        """CORS origins as a clean list, split on commas."""
        return [o.strip() for o in self.cors_origins_raw.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()