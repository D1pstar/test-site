"""The editable site document (theme, navigation, footer, pages, blocks).

This is the single contract between the admin editor and the public site. It is
validated strictly on every save: unknown fields are rejected, every string has
a length cap, and every URL/colour/font is checked against an allow-list. The
frontend renders all text as plain text (never HTML), so a compromised or
careless admin session still can't inject script into visitors' browsers.
"""

import re
from typing import Annotated, Literal, Union

from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
    model_validator,
)

# --------------------------------------------------------------------------
# Primitive, validated string types
# --------------------------------------------------------------------------

_LINK_RE = re.compile(
    r"^(?:"
    r"/(?!/)[^\s<>\"'\\]*"  # internal path (single leading slash)
    r"|#[A-Za-z0-9_-]+"  # in-page anchor
    r"|https?://[^\s<>\"'\\]+"  # external
    r"|mailto:[^\s<>\"'\\]+"
    r"|tel:[+0-9()\-.\s]+"
    r")$",
    re.IGNORECASE,
)
_IMAGE_RE = re.compile(
    r"^(?:/api/media/[0-9a-f]{32}\.(?:png|jpg|gif|webp)|https://[^\s<>\"'\\]+)$"
)
_EMAIL_RE = re.compile(r"^[^\s@<>\"']+@[^\s@<>\"']+\.[^\s@<>\"']+$")
_PAGE_PATH_RE = re.compile(r"^/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$")


def _check(regex: re.Pattern[str], what: str, allow_empty: bool = True):
    def validator(value: str) -> str:
        if value == "" and allow_empty:
            return value
        if not regex.match(value):
            raise ValueError(f"invalid {what}")
        return value

    return validator


Short = Annotated[str, StringConstraints(max_length=200)]
Tiny = Annotated[str, StringConstraints(max_length=60)]
Medium = Annotated[str, StringConstraints(max_length=600)]
Long = Annotated[str, StringConstraints(max_length=5000)]
Huge = Annotated[str, StringConstraints(max_length=20000)]
Url = Annotated[str, StringConstraints(max_length=500), AfterValidator(_check(_LINK_RE, "link"))]
ImageUrl = Annotated[
    str, StringConstraints(max_length=500), AfterValidator(_check(_IMAGE_RE, "image URL"))
]
IconName = Annotated[str, StringConstraints(max_length=40, pattern=r"^[A-Za-z0-9]*$")]
Email = Annotated[
    str, StringConstraints(max_length=120), AfterValidator(_check(_EMAIL_RE, "email"))
]
Identifier = Annotated[str, StringConstraints(min_length=1, max_length=40, pattern=r"^[A-Za-z0-9_-]+$")]
HexColor = Annotated[str, StringConstraints(pattern=r"^#[0-9a-fA-F]{6}$")]

Align = Literal["left", "center"]
FontKey = Literal[
    "inter",
    "system",
    "poppins",
    "dm-sans",
    "space-grotesk",
    "montserrat",
    "playfair",
    "lora",
    "merriweather",
]


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class LinkItem(Strict):
    label: Annotated[str, StringConstraints(max_length=80)]
    to: Url


# --------------------------------------------------------------------------
# Block props (one model per block type)
# --------------------------------------------------------------------------


class PageHeaderProps(Strict):
    eyebrow: Short
    title: Short
    description: Medium
    align: Align


class HeroProps(Strict):
    badgeTag: Annotated[str, StringConstraints(max_length=30)]
    badge: Short
    title: Short
    highlight: Short
    subtitle: Medium
    primaryCta: LinkItem
    secondaryCta: LinkItem
    ratingValue: Annotated[str, StringConstraints(max_length=20)]
    trustText: Short
    showMockup: bool
    mockupDomain: Tiny
    imageUrl: ImageUrl
    imageAlt: Short


class TextItem(Strict):
    text: Tiny


class MarqueeProps(Strict):
    label: Short
    items: Annotated[list[TextItem], Field(max_length=30)]


class StatItem(Strict):
    value: Annotated[str, StringConstraints(max_length=20)]
    label: Tiny


class StatsProps(Strict):
    items: Annotated[list[StatItem], Field(min_length=1, max_length=4)]


class ServicesGridProps(Strict):
    eyebrow: Short
    title: Short
    description: Medium
    columns: Literal[3, 4]
    limit: Annotated[int, Field(ge=0, le=24)]
    showLink: bool
    linkLabel: Tiny
    linkTo: Url
    emptyText: Short


class IconCard(Strict):
    icon: IconName
    title: Short
    body: Medium


class StepsProps(Strict):
    eyebrow: Short
    title: Short
    description: Medium
    align: Align
    items: Annotated[list[IconCard], Field(max_length=12)]


class FeaturesProps(Strict):
    eyebrow: Short
    title: Short
    description: Medium
    columns: Literal[2, 3, 4]
    cta: LinkItem
    items: Annotated[list[IconCard], Field(max_length=12)]


class TestimonialItem(Strict):
    quote: Medium
    name: Short
    role: Short
    avatarUrl: ImageUrl


class TestimonialsProps(Strict):
    eyebrow: Short
    title: Short
    description: Medium
    items: Annotated[list[TestimonialItem], Field(max_length=12)]


class FaqItem(Strict):
    q: Short
    a: Annotated[str, StringConstraints(max_length=2000)]


class FaqProps(Strict):
    eyebrow: Short
    title: Short
    description: Medium
    items: Annotated[list[FaqItem], Field(max_length=30)]


class CtaBandProps(Strict):
    title: Short
    description: Medium
    primary: LinkItem
    secondary: LinkItem


class TextProps(Strict):
    eyebrow: Short
    title: Short
    body: Huge
    align: Align


class ImageProps(Strict):
    imageUrl: ImageUrl
    alt: Short
    caption: Short
    size: Literal["normal", "wide"]


class ImageTextProps(Strict):
    eyebrow: Short
    title: Short
    body: Long
    imageUrl: ImageUrl
    alt: Short
    imageSide: Literal["left", "right"]
    cta: LinkItem


class ContactFormProps(Strict):
    eyebrow: Short
    title: Short
    intro: Medium
    showDetails: bool
    formTitle: Short
    formNote: Short
    submitLabel: Annotated[str, StringConstraints(max_length=40)]
    successTitle: Short
    successBody: Medium
    privacyNote: Short


class SpacerProps(Strict):
    size: Literal["sm", "md", "lg"]


# --------------------------------------------------------------------------
# Blocks (discriminated union on `type`)
# --------------------------------------------------------------------------


class BlockBase(Strict):
    id: Identifier
    hidden: bool = False


class PageHeaderBlock(BlockBase):
    type: Literal["page_header"]
    props: PageHeaderProps


class HeroBlock(BlockBase):
    type: Literal["hero"]
    props: HeroProps


class MarqueeBlock(BlockBase):
    type: Literal["marquee"]
    props: MarqueeProps


class StatsBlock(BlockBase):
    type: Literal["stats"]
    props: StatsProps


class ServicesGridBlock(BlockBase):
    type: Literal["services_grid"]
    props: ServicesGridProps


class StepsBlock(BlockBase):
    type: Literal["steps"]
    props: StepsProps


class FeaturesBlock(BlockBase):
    type: Literal["features"]
    props: FeaturesProps


class TestimonialsBlock(BlockBase):
    type: Literal["testimonials"]
    props: TestimonialsProps


class FaqBlock(BlockBase):
    type: Literal["faq"]
    props: FaqProps


class CtaBandBlock(BlockBase):
    type: Literal["cta_band"]
    props: CtaBandProps


class TextBlock(BlockBase):
    type: Literal["text"]
    props: TextProps


class ImageBlock(BlockBase):
    type: Literal["image"]
    props: ImageProps


class ImageTextBlock(BlockBase):
    type: Literal["image_text"]
    props: ImageTextProps


class ContactFormBlock(BlockBase):
    type: Literal["contact_form"]
    props: ContactFormProps


class SpacerBlock(BlockBase):
    type: Literal["spacer"]
    props: SpacerProps


Block = Annotated[
    Union[
        PageHeaderBlock,
        HeroBlock,
        MarqueeBlock,
        StatsBlock,
        ServicesGridBlock,
        StepsBlock,
        FeaturesBlock,
        TestimonialsBlock,
        FaqBlock,
        CtaBandBlock,
        TextBlock,
        ImageBlock,
        ImageTextBlock,
        ContactFormBlock,
        SpacerBlock,
    ],
    Field(discriminator="type"),
]

# --------------------------------------------------------------------------
# Site-level settings
# --------------------------------------------------------------------------


class Theme(Strict):
    siteName: Annotated[str, StringConstraints(min_length=1, max_length=60)]
    logoUrl: ImageUrl
    faviconUrl: ImageUrl
    brandColor: HexColor
    headingFont: FontKey
    bodyFont: FontKey


class Contact(Strict):
    email: Email
    phone: Annotated[str, StringConstraints(max_length=40)]
    location: Annotated[str, StringConstraints(max_length=80)]
    responseTime: Short


class Nav(Strict):
    links: Annotated[list[LinkItem], Field(max_length=12)]
    cta: LinkItem


class FooterColumn(Strict):
    title: Annotated[str, StringConstraints(max_length=60)]
    links: Annotated[list[LinkItem], Field(max_length=12)]


class Footer(Strict):
    tagline: Annotated[str, StringConstraints(max_length=500)]
    columns: Annotated[list[FooterColumn], Field(max_length=4)]
    showContact: bool
    contactTitle: Annotated[str, StringConstraints(max_length=60)]
    bottomLeft: Short
    bottomRight: Short


class Page(Strict):
    id: Identifier
    path: Annotated[str, StringConstraints(max_length=120)]
    title: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    description: Annotated[str, StringConstraints(max_length=300)]
    blocks: Annotated[list[Block], Field(max_length=60)]

    @model_validator(mode="after")
    def _check_path(self) -> "Page":
        if not _PAGE_PATH_RE.match(self.path):
            raise ValueError("page path must be lowercase letters, numbers and dashes, e.g. /about")
        for reserved in ("/admin", "/api"):
            if self.path == reserved or self.path.startswith(reserved + "/"):
                raise ValueError(f"{reserved} is reserved")
        if self.path.startswith("/services/"):
            raise ValueError("/services/... is reserved for service detail pages")
        ids = [b.id for b in self.blocks]
        if len(ids) != len(set(ids)):
            raise ValueError("duplicate block ids on a page")
        return self


MAX_DOCUMENT_BYTES = 400_000


class SiteContent(Strict):
    version: Literal[1]
    theme: Theme
    contact: Contact
    nav: Nav
    footer: Footer
    pages: Annotated[list[Page], Field(min_length=1, max_length=30)]

    @model_validator(mode="after")
    def _check_pages(self) -> "SiteContent":
        paths = [p.path for p in self.pages]
        if len(paths) != len(set(paths)):
            raise ValueError("two pages share the same path")
        if "/" not in paths:
            raise ValueError("a home page with path '/' is required")
        ids = [p.id for p in self.pages]
        if len(ids) != len(set(ids)):
            raise ValueError("duplicate page ids")
        if len(self.model_dump_json()) > MAX_DOCUMENT_BYTES:
            raise ValueError("site content is too large")
        return self


# --------------------------------------------------------------------------
# API envelopes
# --------------------------------------------------------------------------


class PublicSite(BaseModel):
    content: SiteContent | None


class AdminSite(BaseModel):
    draft: SiteContent | None
    published: SiteContent | None
    has_unpublished: bool
    draft_updated_at: str | None
    published_at: str | None


class DraftSaved(BaseModel):
    has_unpublished: bool
    draft_updated_at: str


class MediaRead(BaseModel):
    id: int
    url: str
    name: str
    mime: str
    size: int
    created_at: str


class ServiceWrite(Strict):
    slug: Annotated[
        str, StringConstraints(min_length=1, max_length=80, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    ]
    title: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    summary: Annotated[str, StringConstraints(min_length=1, max_length=240)]
    description: Annotated[str, StringConstraints(max_length=10000)]
    icon: Annotated[str, StringConstraints(min_length=1, max_length=40, pattern=r"^[A-Za-z0-9]+$")]
    sort_order: Annotated[int, Field(ge=0, le=10000)] = 0
