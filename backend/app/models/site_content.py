from datetime import datetime

from sqlalchemy import DateTime, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SiteContentRow(Base):
    """Singleton row (id=1) holding the draft and published site documents as JSON."""

    __tablename__ = "site_content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    draft_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    published_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    draft_updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
