from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


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

    @property
    def cors_origins(self) -> list[str]:
        """CORS origins as a clean list, split on commas."""
        return [o.strip() for o in self.cors_origins_raw.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()