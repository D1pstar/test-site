"""Admin-only endpoints: site draft/publish, media library, services CRUD."""

import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, status
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.limiter import limiter
from app.models import AdminUser, Media, Service, SiteContentRow
from app.routers.public_site import upload_path
from app.schemas import ServiceRead
from app.schemas.site import (
    AdminSite,
    DraftSaved,
    MediaRead,
    ServiceWrite,
    SiteContent,
)
from app.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin-content"], dependencies=[Depends(get_current_admin)])


def _iso(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:  # SQLite returns naive UTC
        value = value.replace(tzinfo=timezone.utc)
    return value.isoformat()


def _row(db: Session) -> SiteContentRow:
    row = db.get(SiteContentRow, 1)
    if row is None:
        row = SiteContentRow(id=1)
        db.add(row)
        db.flush()
    return row


def _parse(raw: str | None) -> SiteContent | None:
    if not raw:
        return None
    try:
        return SiteContent.model_validate_json(raw)
    except ValidationError:
        return None


# --------------------------------------------------------------------------
# Site draft / publish
# --------------------------------------------------------------------------


@router.get("/site", response_model=AdminSite)
def get_admin_site(db: Session = Depends(get_db)) -> AdminSite:
    row = _row(db)
    db.commit()
    return AdminSite(
        draft=_parse(row.draft_json),
        published=_parse(row.published_json),
        has_unpublished=row.draft_json is not None and row.draft_json != row.published_json,
        draft_updated_at=_iso(row.draft_updated_at),
        published_at=_iso(row.published_at),
    )


@router.put("/site/draft", response_model=DraftSaved)
def save_draft(content: SiteContent, db: Session = Depends(get_db)) -> DraftSaved:
    row = _row(db)
    row.draft_json = content.model_dump_json()  # canonical form, so equality means "same"
    row.draft_updated_at = datetime.now(timezone.utc)
    db.commit()
    return DraftSaved(
        has_unpublished=row.draft_json != row.published_json,
        draft_updated_at=_iso(row.draft_updated_at) or "",
    )


@router.post("/site/publish", response_model=AdminSite)
def publish(db: Session = Depends(get_db)) -> AdminSite:
    row = _row(db)
    if not row.draft_json:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Nothing to publish: save a draft first")
    row.published_json = row.draft_json
    row.published_at = datetime.now(timezone.utc)
    db.commit()
    return get_admin_site(db)


@router.post("/site/discard", response_model=AdminSite)
def discard(db: Session = Depends(get_db)) -> AdminSite:
    """Throw the draft away and go back to what is published."""
    row = _row(db)
    row.draft_json = row.published_json
    row.draft_updated_at = datetime.now(timezone.utc) if row.published_json else None
    db.commit()
    return get_admin_site(db)


# --------------------------------------------------------------------------
# Media library
# --------------------------------------------------------------------------


def _detect_image(head: bytes) -> tuple[str, str] | None:
    """Identify an image by its magic bytes (never trust the filename or Content-Type)."""
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png", "image/png"
    if head.startswith(b"\xff\xd8\xff"):
        return "jpg", "image/jpeg"
    if head[:6] in (b"GIF87a", b"GIF89a"):
        return "gif", "image/gif"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "webp", "image/webp"
    return None


def _media_read(m: Media) -> MediaRead:
    return MediaRead(
        id=m.id,
        url=f"/api/media/{m.stored_name}",
        name=m.original_name,
        mime=m.mime,
        size=m.size,
        created_at=_iso(m.created_at) or "",
    )


@router.get("/media", response_model=list[MediaRead])
def list_media(db: Session = Depends(get_db)) -> list[MediaRead]:
    rows = db.scalars(select(Media).order_by(Media.created_at.desc(), Media.id.desc())).all()
    return [_media_read(m) for m in rows]


@router.post("/media", response_model=MediaRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("60/minute")
def upload_media(request: Request, file: UploadFile, db: Session = Depends(get_db)) -> MediaRead:
    limit = settings.max_upload_mb * 1024 * 1024
    data = file.file.read(limit + 1)
    if len(data) > limit:
        raise HTTPException(413, detail=f"File is larger than {settings.max_upload_mb} MB")
    kind = _detect_image(data[:16])
    if kind is None:
        raise HTTPException(415, detail="Only PNG, JPEG, GIF and WebP images are allowed")
    ext, mime = kind

    stored = f"{secrets.token_hex(16)}.{ext}"
    (upload_path() / stored).write_bytes(data)

    original = (file.filename or "image").replace("\\", "/").rsplit("/", 1)[-1][:200] or "image"
    media = Media(stored_name=stored, original_name=original, mime=mime, size=len(data))
    db.add(media)
    db.commit()
    db.refresh(media)
    return _media_read(media)


@router.delete("/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(media_id: int, db: Session = Depends(get_db)) -> None:
    media = db.get(Media, media_id)
    if media is None:
        raise HTTPException(404, detail="Image not found")
    url = f"/api/media/{media.stored_name}"
    row = db.get(SiteContentRow, 1)
    if row and any(url in (doc or "") for doc in (row.draft_json, row.published_json)):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail="This image is used on the site. Remove it from the pages first (and publish), then delete it.",
        )
    (upload_path() / media.stored_name).unlink(missing_ok=True)
    db.delete(media)
    db.commit()


# --------------------------------------------------------------------------
# Services (database records, live immediately: they have their own detail pages)
# --------------------------------------------------------------------------


@router.post("/services", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceWrite, db: Session = Depends(get_db)) -> Service:
    service = Service(**payload.model_dump())
    db.add(service)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, detail="A service with this slug already exists") from None
    db.refresh(service)
    return service


@router.put("/services/{service_id}", response_model=ServiceRead)
def update_service(service_id: int, payload: ServiceWrite, db: Session = Depends(get_db)) -> Service:
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(404, detail="Service not found")
    for key, value in payload.model_dump().items():
        setattr(service, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, detail="A service with this slug already exists") from None
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db)) -> None:
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(404, detail="Service not found")
    db.delete(service)
    db.commit()
