"""Password hashing and signed admin-session cookies."""

import hashlib

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from fastapi import Cookie, Depends, HTTPException, status
from itsdangerous import BadSignature, URLSafeTimedSerializer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import AdminUser

COOKIE_NAME = "admin_session"
COOKIE_PATH = "/api"

_hasher = PasswordHasher()
_serializer = URLSafeTimedSerializer(settings.secret_key, salt="admin-session")
# Verified against when the username doesn't exist, so response time doesn't
# reveal which usernames are real.
_DUMMY_HASH = _hasher.hash("not-a-real-password")


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str | None, password: str) -> bool:
    try:
        return _hasher.verify(password_hash or _DUMMY_HASH, password) and password_hash is not None
    except (VerificationError, InvalidHashError):
        return False


def _fingerprint(password_hash: str) -> str:
    # Changing a password invalidates that user's existing sessions.
    return hashlib.sha256(password_hash.encode()).hexdigest()[:16]


def create_session_token(user: AdminUser) -> str:
    return _serializer.dumps({"uid": user.id, "pv": _fingerprint(user.password_hash)})


def get_current_admin(
    token: str | None = Cookie(default=None, alias=COOKIE_NAME),
    db: Session = Depends(get_db),
) -> AdminUser:
    unauthorized = HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    if not token:
        raise unauthorized
    try:
        data = _serializer.loads(token, max_age=settings.session_hours * 3600)
    except BadSignature:
        raise unauthorized from None
    user = db.scalar(select(AdminUser).where(AdminUser.id == data.get("uid")))
    if user is None or data.get("pv") != _fingerprint(user.password_hash):
        raise unauthorized
    return user
