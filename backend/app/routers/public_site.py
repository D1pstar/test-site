"""Public, unauthenticated reads: the published site document and uploaded images."""

import logging
import re
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import SiteContentRow
from app.schemas.site import PublicSite, SiteContent

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["site"])

_MEDIA_NAME = re.compile(r"^[0-9a-f]{32}\.(png|jpg|gif|webp)$")
_MIME = {"png": "image/png", "jpg": "image/jpeg", "gif": "image/gif", "webp": "image/webp"}


def upload_path() -> Path:
    path = Path(settings.upload_dir).resolve()
    path.mkdir(parents=True, exist_ok=True)
    return path


@router.get("/site", response_model=PublicSite)
def get_site(response: Response, db: Session = Depends(get_db)) -> PublicSite:
    # Always revalidate so a Publish shows up right away.
    response.headers["Cache-Control"] = "no-cache"
    row = db.get(SiteContentRow, 1)
    if row is None or not row.published_json:
        return PublicSite(content=None)
    try:
        return PublicSite(content=SiteContent.model_validate_json(row.published_json))
    except ValidationError:
        # Stored document no longer matches the schema: fall back to built-in defaults.
        log.exception("published site content failed validation")
        return PublicSite(content=None)


@router.get("/media/{name}")
def get_media(name: str) -> FileResponse:
    if not _MEDIA_NAME.match(name):  # strict whitelist also rules out path traversal
        raise HTTPException(404, "Not found")
    path = upload_path() / name
    if not path.is_file():
        raise HTTPException(404, "Not found")
    return FileResponse(
        path,
        media_type=_MIME[name.rsplit(".", 1)[1]],
        headers={
            "Cache-Control": "public, max-age=31536000, immutable",  # names are random, never reused
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'; sandbox",
        },
    )
