from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Testimonial
from app.schemas import TestimonialRead

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialRead])
def list_testimonials(db: Session = Depends(get_db)) -> list[Testimonial]:
    stmt = select(Testimonial).order_by(Testimonial.sort_order, Testimonial.id)
    return list(db.scalars(stmt).all())
