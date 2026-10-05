"""ORM models package.

Alembic's env.py imports this module so that all models are registered
on ``Base.metadata`` before autogenerate runs. Add new model imports
below as they are created.
"""

from app.models.ping import Ping  # noqa: F401

__all__ = ["Ping"]