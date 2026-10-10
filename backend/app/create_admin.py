"""Create an admin user, or reset an existing one's password.

Run from the backend/ folder:
    python -m app.create_admin --username client
"""

import argparse
import getpass
import sys

from sqlalchemy import select

from app.database import SessionLocal
from app.models import AdminUser
from app.security import hash_password

MIN_LENGTH = 12


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or reset an admin user.")
    parser.add_argument("--username", required=True)
    args = parser.parse_args()

    username = args.username.strip()
    if not username or len(username) > 64:
        print("Username must be 1-64 characters.")
        return 1

    password = getpass.getpass("Password: ")
    if len(password) < MIN_LENGTH:
        print(f"Password must be at least {MIN_LENGTH} characters.")
        return 1
    if password != getpass.getpass("Repeat password: "):
        print("Passwords do not match.")
        return 1

    with SessionLocal() as db:
        user = db.scalar(select(AdminUser).where(AdminUser.username == username))
        if user is None:
            db.add(AdminUser(username=username, password_hash=hash_password(password)))
            action = "Created"
        else:
            user.password_hash = hash_password(password)
            action = "Updated password for"
        db.commit()
    print(f"{action} admin user '{username}'.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
