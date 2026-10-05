from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Testimonial
from app.schemas import TestimonialCreate, TestimonialRead

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialRead])
def list_testimonials(db: Session = Depends(get_db)) -> list[Testimonial]:
    stmt = select(Testimonial).order_by(Testimonial.sort_order, Testimonial.id)
    return list(db.scalars(stmt).all())


@router.post("", response_model=TestimonialRead, status_code=status.HTTP_201_CREATED)
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)) -> Testimonial:
    testimonial = Testimonial(**payload.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial