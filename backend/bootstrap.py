"""Run once on every deploy before the server starts.

1. Fresh database -> create all tables and mark migrations as applied.
   Existing database -> apply pending migrations.
2. If ADMIN_USERNAME and ADMIN_PASSWORD are set and that admin does not exist,
   create it (never overwrites an existing account). Remove ADMIN_PASSWORD afterwards.
"""

import os
import subprocess
import sys

from sqlalchemy import inspect, select

import app.models  # noqa: F401  (registers tables)
from app.database import Base, SessionLocal, engine
from app.models import AdminUser
from app.security import hash_password


def run(*args: str) -> None:
    subprocess.run([sys.executable, "-m", "alembic", *args], check=True)


if "alembic_version" in inspect(engine).get_table_names():
    run("upgrade", "head")
else:
    Base.metadata.create_all(engine)
    run("stamp", "head")

user, pw = os.environ.get("ADMIN_USERNAME", "").strip(), os.environ.get("ADMIN_PASSWORD", "")
if user and pw:
    if len(pw) < 12:
        print("ADMIN_PASSWORD must be at least 12 characters; skipping admin creation.")
    else:
        with SessionLocal() as db:
            if db.scalar(select(AdminUser).where(AdminUser.username == user)) is None:
                db.add(AdminUser(username=user, password_hash=hash_password(pw)))
                db.commit()
                print(f"Created admin '{user}'.")
