from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import contact, health, projects, seed, services, testimonials

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(services.router)
app.include_router(projects.router)
app.include_router(testimonials.router)
app.include_router(contact.router)
app.include_router(seed.router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": f"{settings.app_name} API", "docs": "/docs"}