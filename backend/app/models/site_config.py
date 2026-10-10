from datetime import datetime

from sqlalchemy import DateTime, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SiteConfig(Base):
    __tablename__ = "site_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    draft: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    published: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
