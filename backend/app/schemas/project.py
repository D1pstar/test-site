from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class ProjectBase(BaseModel):
    slug: str
    title: str
    client: str
    summary: str
    description: str
    cover_image_url: str
    tags: str = ""
    year: int
    sort_order: int = 0

    @field_validator("tags", mode="before")
    @classmethod
    def _stringify_tags(cls, value: object) -> object:
        """Accept either a list (from JSON bodies) or a comma string."""
        if isinstance(value, list):
            return ",".join(str(v) for v in value)
        return value


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

    @property
    def tag_list(self) -> list[str]:
        return [t for t in self.tags.split(",") if t]