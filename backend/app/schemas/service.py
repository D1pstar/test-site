from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    slug: str
    title: str
    summary: str
    description: str
    icon: str
    sort_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceRead(ServiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime