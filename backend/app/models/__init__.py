"""ORM models package.

Alembic's env.py imports this module so that all models are registered
on ``Base.metadata`` before autogenerate runs. Add new model imports
below as they are created.
"""

from app.models.contact import ContactMessage
from app.models.project import Project
from app.models.service import Service
from app.models.testimonial import Testimonial

__all__ = [
    "ContactMessage",
    "Project",
    "Service",
    "Testimonial",
]