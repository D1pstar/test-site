from copy import deepcopy
from pathlib import Path
import base64
from uuid import uuid4

from fastapi import APIRouter, Body, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AdminUser, SiteConfig
from app.schemas.site import SiteConfigRead, SiteDraftUpdate
from app.security import get_current_admin

router = APIRouter(tags=["site"])

DEFAULT_CONFIG = {
    "version": 1,
        "theme": {
            "primary": "#6d5dfc",
            "secondary": "#c15cff",
            # Light palette (used when .dark is OFF)
            "background": "#f8fafc",
            "surface": "#ffffff",
            "text": "#101828",
            "muted": "#667085",
            # Dark palette (used when .dark is ON)
            "darkBackground": "#080b16",
            "darkSurface": "#101525",
            "darkText": "#f8fafc",
            "darkMuted": "#98a2b3",
            "font": "Inter",
            "radius": "24px",
            "logoText": "test-site",
            "logoImage": "",
            "darkMode": True,
        },
    "navigation": {
        "items": [
            {"label": "Home", "href": "/"},
            {"label": "Services", "href": "/services"},
            {"label": "About", "href": "/about"},
            {"label": "Contact", "href": "/contact"},
        ],
        "ctaLabel": "Start a project",
        "ctaHref": "/contact",
    },
    "footer": {
        "description": "A demo studio site used to show what a modern web presence can look like.",
        "email": "hello@test-site.dev",
        "phone": "+1 (555) 555-0100",
        "location": "Remote · Worldwide",
        "copyright": "{year} test-site. Demo only.",
    },
    "pages": [
        {
            "id": "home",
            "slug": "/",
            "title": "Home",
            "seoTitle": "test-site",
            "seoDescription": "A modern studio website.",
            "blocks": [
                {"id": "hero-1", "type": "hero", "enabled": True, "settings": {"eyebrow": "New · Taking on projects", "title": "A web presence that does your work justice.", "body": "We design and build fast, modern websites that look sharp, read clearly, and turn visitors into customers.", "primaryLabel": "Start a project", "primaryHref": "/contact", "secondaryLabel": "What we do", "secondaryHref": "/services", "image": ""}},
                {"id": "stats-1", "type": "stats", "enabled": True, "settings": {"items": [{"value": "120+", "label": "Projects shipped"}, {"value": "8", "label": "Years in business"}, {"value": "4.9", "label": "Avg. client rating"}]}},
                {"id": "text-1", "type": "text", "enabled": True, "settings": {"eyebrow": "The approach", "title": "Built to be edited, not babysat.", "body": "Every part of this site can be managed from the admin panel. Rearrange sections, change copy, swap images, tune the theme, and publish when it is ready.", "align": "center"}},
                {"id": "cta-1", "type": "cta", "enabled": True, "settings": {"title": "Ready to make it yours?", "body": "Build a draft, preview it, then publish when everything looks right.", "label": "Start a project", "href": "/contact"}},
            ],
        },
        {"id": "services", "slug": "/services", "title": "Services", "seoTitle": "Services", "seoDescription": "Services", "blocks": [{"id": "services-1", "type": "services", "enabled": True, "settings": {"title": "What we do", "body": "Choose the pieces you need and shape the page around them."}}]},
        {"id": "about", "slug": "/about", "title": "About", "seoTitle": "About", "seoDescription": "About", "blocks": [{"id": "about-1", "type": "text", "enabled": True, "settings": {"eyebrow": "About", "title": "A small studio with a big toolbox.", "body": "This page is editable from the admin panel. Add more blocks whenever you need them.", "align": "left"}}]},
        {"id": "contact", "slug": "/contact", "title": "Contact", "seoTitle": "Contact", "seoDescription": "Contact", "blocks": [{"id": "contact-1", "type": "text", "enabled": True, "settings": {"eyebrow": "Contact", "title": "Tell us what you are building.", "body": "Use the form below to get in touch.", "align": "left"}}]},
    ],
}

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}


def get_or_create(db: Session) -> SiteConfig:
    row = db.scalar(select(SiteConfig).where(SiteConfig.id == 1))
    if row is None:
        row = SiteConfig(id=1, draft=deepcopy(DEFAULT_CONFIG), published=deepcopy(DEFAULT_CONFIG))
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("/api/site", response_model=dict)
def public_site(db: Session = Depends(get_db)) -> dict:
    return get_or_create(db).published


@router.get("/api/admin/site", response_model=SiteConfigRead)
def admin_site(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> SiteConfig:
    return get_or_create(db)


@router.put("/api/admin/site/draft", response_model=SiteConfigRead)
def update_draft(payload: SiteDraftUpdate, _: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> SiteConfig:
    row = get_or_create(db)
    row.draft = payload.config
    db.commit()
    db.refresh(row)
    return row


@router.post("/api/admin/site/publish", response_model=SiteConfigRead)
def publish(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> SiteConfig:
    row = get_or_create(db)
    row.published = deepcopy(row.draft)
    db.commit()
    db.refresh(row)
    return row


@router.post("/api/admin/media", response_model=dict)
async def upload_media(payload: dict = Body(...), _: AdminUser = Depends(get_current_admin)) -> dict:
    data_url = str(payload.get("data_url", ""))
    original_name = str(payload.get("name", "image"))
    if not data_url.startswith("data:image/") or ";base64," not in data_url:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Expected a base64 image")
    header, encoded = data_url.split(",", 1)
    mime = header[5:].split(";", 1)[0]
    if mime not in ALLOWED:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Only image files are allowed")
    try:
        data = base64.b64decode(encoded, validate=True)
    except Exception as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid image data") from exc
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image must be 10 MB or smaller")
    ext = Path(original_name).suffix.lower() or {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/svg+xml": ".svg"}[mime]
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{uuid4().hex}{ext}"
    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"/uploads/{name}", "name": original_name, "size": len(data)}

@router.get("/uploads/{filename}")
def uploaded_file(filename: str):
    path = (UPLOAD_DIR / filename).resolve()
    if path.parent != UPLOAD_DIR.resolve() or not path.is_file():
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="File not found")
    return FileResponse(path)
