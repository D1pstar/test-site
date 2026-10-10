from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.limiter import limiter
from app.models import ContactMessage
from app.schemas import ContactMessageCreate, ContactMessageRead

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute;30/day")
def submit_contact(
    request: Request,  # required by slowapi
    payload: ContactMessageCreate,
    db: Session = Depends(get_db),
) -> ContactMessage:
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


# NOTE: the public GET (list all messages) was removed: it exposed every
# visitor's name/email/message. Add an authenticated admin route if needed.
