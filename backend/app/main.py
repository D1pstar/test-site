from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.limiter import limiter
from app.routers import admin, admin_content, contact, health, projects, public_site, seed, services, testimonials

is_dev = settings.app_env == "development"

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug and is_dev,
    version="0.1.0",
    # Hide interactive docs/schema outside development.
    docs_url="/docs" if is_dev else None,
    redoc_url="/redoc" if is_dev else None,
    openapi_url="/openapi.json" if is_dev else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,  # no cookies/auth used, so don't allow credentialed CORS
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
)

app.include_router(health.router)
app.include_router(services.router)
app.include_router(projects.router)
app.include_router(testimonials.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(admin_content.router)
app.include_router(public_site.router)

# Destructive sample-data endpoint: development only.
if is_dev:
    app.include_router(seed.router)


_static = Path(settings.static_dir).resolve()
_index = _static / "index.html"

if _index.is_file():
    # Serve the built website. Registered last, so every /api route wins.
    @app.get("/{path:path}", include_in_schema=False)
    def website(path: str) -> FileResponse:
        if path == "api" or path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        target = (_static / path).resolve()
        if path and target.is_file() and _static in target.parents:
            headers = {"Cache-Control": "public, max-age=31536000, immutable"} if path.startswith("assets/") else {}
            return FileResponse(target, headers=headers)
        return FileResponse(_index, headers={"Cache-Control": "no-cache"})  # single-page app fallback
else:

    @app.get("/")
    def root() -> dict[str, str]:
        return {"message": f"{settings.app_name} API"}
