from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TestimonialBase(BaseModel):
    author_name: str
    author_role: str
    author_company: str
    quote: str
    avatar_url: str
    sort_order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialRead(TestimonialBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime