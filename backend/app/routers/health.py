from fastapi import APIRouter

from app.config import settings

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    """Liveness probe used by the frontend and by curl during dev."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "env": settings.app_env,
    }