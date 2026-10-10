"""Run once on every deploy before the server starts.

1. Fresh database -> create all tables and mark migrations as applied.
   Existing database -> apply pending migrations.
2. If a starter site file exists (SEED_SITE_FILE, default seed/site.json, written by the
   sitegen tool) and the site has never been edited, publish it and add its services.
   It only fills an empty site and never overwrites anything.
3. If ADMIN_USERNAME and ADMIN_PASSWORD are set and that admin does not exist,
   create it (never overwrites an existing account). Remove ADMIN_PASSWORD afterwards.
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from pydantic import ValidationError
from sqlalchemy import func, inspect, select, text

import app.models  # noqa: F401  (registers tables)
from app.database import Base, SessionLocal, engine
from app.models import AdminUser, Service, SiteContentRow
from app.schemas.site import ServiceWrite, SiteContent
from app.security import hash_password


def run(*args: str) -> None:
    subprocess.run([sys.executable, "-m", "alembic", *args], check=True)


def has_migration_state() -> bool:
    if "alembic_version" not in inspect(engine).get_table_names():
        return False
    with engine.connect() as c:
        return c.execute(text("SELECT COUNT(*) FROM alembic_version")).scalar_one() > 0


if has_migration_state():
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


# ---- starter content (from the sitegen tool) ---------------------------------
seed = Path(os.environ.get("SEED_SITE_FILE", "seed/site.json"))
if seed.is_file():
    try:
        data = json.loads(seed.read_text(encoding="utf-8"))
        site = SiteContent.model_validate(data["site"])
        services = [ServiceWrite.model_validate(x) for x in data.get("services", [])]
    except (OSError, ValueError, KeyError, ValidationError) as exc:
        print(f"Starter site file {seed} is invalid, skipping it: {exc}")
    else:
        with SessionLocal() as db:
            row = db.get(SiteContentRow, 1)
            if row is None:
                row = SiteContentRow(id=1)
                db.add(row)
            if not row.draft_json and not row.published_json:
                now = datetime.now(timezone.utc)
                row.draft_json = row.published_json = site.model_dump_json()
                row.draft_updated_at = row.published_at = now
                print(f"Published starter site '{site.theme.siteName}'.")
            if db.scalar(select(func.count(Service.id))) == 0:
                for s in services:
                    db.add(Service(**s.model_dump()))
                if services:
                    print(f"Added {len(services)} starter services.")
            db.commit()
