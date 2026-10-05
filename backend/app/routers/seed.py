"""Dev-only endpoint that populates the DB with sample content.

Idempotent: wipes and re-inserts the seeded rows on each call. Only used
while building the demo site; remove or gate behind a flag before shipping
anything real.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, Service, Testimonial

router = APIRouter(prefix="/api/seed", tags=["seed"])


SERVICES = [
    {
        "slug": "web-design",
        "title": "Web Design",
        "summary": "Modern, responsive interfaces crafted for conversion.",
        "description": (
            "We design clean, accessible interfaces that look sharp on every "
            "screen and guide visitors toward the actions that matter."
        ),
        "icon": "Palette",
        "sort_order": 1,
    },
    {
        "slug": "development",
        "title": "Development",
        "summary": "Fast, maintainable sites built on a modern stack.",
        "description": (
            "From static marketing sites to full-stack applications, we ship "
            "performant code with sensible defaults and clear handoff docs."
        ),
        "icon": "Code2",
        "sort_order": 2,
    },
    {
        "slug": "branding",
        "title": "Branding",
        "summary": "Identity systems that scale across every touchpoint.",
        "description": (
            "Logos, typography, color, and voice — brought together into a "
            "coherent system your team can actually use."
        ),
        "icon": "Sparkles",
        "sort_order": 3,
    },
    {
        "slug": "seo",
        "title": "SEO & Analytics",
        "summary": "Get found, then measure what's working.",
        "description": (
            "Technical SEO, content structure, and analytics setups that give "
            "you real signal instead of vanity metrics."
        ),
        "icon": "TrendingUp",
        "sort_order": 4,
    },
]


PROJECTS = [
    {
        "slug": "northwind-coffee",
        "title": "Northwind Coffee",
        "client": "Northwind Coffee Roasters",
        "summary": "A warm, editorial site for a specialty roaster.",
        "description": (
            "Rebuilt the brand's web presence around a story-first layout, "
            "subscription flow, and a wholesale portal for cafe partners."
        ),
        "cover_image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
        "tags": "design,development,ecommerce",
        "year": 2024,
        "sort_order": 1,
    },
    {
        "slug": "atlas-legal",
        "title": "Atlas Legal",
        "client": "Atlas Legal Group",
        "summary": "A trustworthy, professional site for a boutique firm.",
        "description": (
            "Content architecture, practice-area pages, and an attorney bio "
            "system built to convert qualified leads."
        ),
        "cover_image_url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
        "tags": "design,seo",
        "year": 2024,
        "sort_order": 2,
    },
    {
        "slug": "harbor-fitness",
        "title": "Harbor Fitness",
        "client": "Harbor Fitness Studio",
        "summary": "Bold, high-energy branding and a booking-first site.",
        "description": (
            "New identity, class schedule integration, and a member portal "
            "that cut front-desk calls roughly in half."
        ),
        "cover_image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
        "tags": "branding,development",
        "year": 2023,
        "sort_order": 3,
    },
    {
        "slug": "pioneer-ag",
        "title": "Pioneer Ag",
        "client": "Pioneer Agricultural Co-op",
        "summary": "A data-driven marketing site for a regional co-op.",
        "description": (
            "Multi-location site with member resources, crop reports, and a "
            "custom CMS the office team updates weekly."
        ),
        "cover_image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
        "tags": "development,seo",
        "year": 2023,
        "sort_order": 4,
    },
]


TESTIMONIALS = [
    {
        "author_name": "Maya Chen",
        "author_role": "Founder",
        "author_company": "Northwind Coffee",
        "quote": (
            "They took a vague idea and turned it into a site we're genuinely "
            "proud to send customers to. Subscriptions are up, support email "
            "is down, and the whole thing just feels like us."
        ),
        "avatar_url": "https://i.pravatar.cc/160?img=47",
        "sort_order": 1,
    },
    {
        "author_name": "Daniel Okafor",
        "author_role": "Managing Partner",
        "author_company": "Atlas Legal Group",
        "quote": (
            "Professional, fast, and precise. They understood what a firm like "
            "ours needed to communicate and delivered it without a lot of back "
            "and forth."
        ),
        "avatar_url": "https://i.pravatar.cc/160?img=12",
        "sort_order": 2,
    },
    {
        "author_name": "Priya Raman",
        "author_role": "Owner",
        "author_company": "Harbor Fitness",
        "quote": (
            "Our members actually use the site now. Scheduling, renewals, "
            "everything is simpler — and the brand finally matches the energy "
            "in the studio."
        ),
        "avatar_url": "https://i.pravatar.cc/160?img=32",
        "sort_order": 3,
    },
]


@router.post("")
def seed(db: Session = Depends(get_db)) -> dict[str, int]:
    db.execute(delete(Service))
    db.execute(delete(Project))
    db.execute(delete(Testimonial))
    db.commit()

    db.add_all(Service(**row) for row in SERVICES)
    db.add_all(Project(**row) for row in PROJECTS)
    db.add_all(Testimonial(**row) for row in TESTIMONIALS)
    db.commit()

    return {
        "services": len(SERVICES),
        "projects": len(PROJECTS),
        "testimonials": len(TESTIMONIALS),
    }