from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Media(Base):
    """An uploaded image. The file lives on disk under a random name."""

    __tablename__ = "media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stored_name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    original_name: Mapped[str] = mapped_column(String(200), nullable=False)
    mime: Mapped[str] = mapped_column(String(40), nullable=False)
    size: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
