from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContactMessage
from app.schemas import ContactMessageCreate, ContactMessageRead

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
def submit_contact(
    payload: ContactMessageCreate, db: Session = Depends(get_db)
) -> ContactMessage:
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("", response_model=list[ContactMessageRead])
def list_contact_messages(db: Session = Depends(get_db)) -> list[ContactMessage]:
    """Dev-only helper so we can eyeball submissions in the browser."""
    stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc())
    return list(db.scalars(stmt).all())