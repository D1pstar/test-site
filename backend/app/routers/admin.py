from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.limiter import limiter
from app.models import AdminUser, ContactMessage
from app.schemas import ContactMessageRead
from app.schemas.admin import AdminMe, LoginRequest, MessageReadUpdate
from app.security import (
    COOKIE_NAME,
    COOKIE_PATH,
    create_session_token,
    get_current_admin,
    verify_password,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=AdminMe)
@limiter.limit("5/minute;30/hour")
def login(
    request: Request,  # required by slowapi
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AdminMe:
    user = db.scalar(select(AdminUser).where(AdminUser.username == payload.username))
    ok = verify_password(user.password_hash if user else None, payload.password)
    if not ok or user is None:
        # Same message for unknown user and wrong password.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    response.set_cookie(
        COOKIE_NAME,
        create_session_token(user),
        max_age=settings.session_hours * 3600,
        httponly=True,
        samesite="strict",
        secure=settings.app_env == "production",
        path=COOKIE_PATH,
    )
    return AdminMe(username=user.username)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path=COOKIE_PATH)


@router.get("/me", response_model=AdminMe)
def me(admin: AdminUser = Depends(get_current_admin)) -> AdminMe:
    return AdminMe(username=admin.username)


@router.get("/messages", response_model=list[ContactMessageRead])
def list_messages(
    _: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)
) -> list[ContactMessage]:
    stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc(), ContactMessage.id.desc())
    return list(db.scalars(stmt).all())


def _get_message(db: Session, message_id: int) -> ContactMessage:
    msg = db.get(ContactMessage, message_id)
    if msg is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Message not found")
    return msg


@router.patch("/messages/{message_id}", response_model=ContactMessageRead)
def set_read(
    message_id: int,
    payload: MessageReadUpdate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ContactMessage:
    msg = _get_message(db, message_id)
    msg.is_read = payload.is_read
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> None:
    db.delete(_get_message(db, message_id))
    db.commit()
