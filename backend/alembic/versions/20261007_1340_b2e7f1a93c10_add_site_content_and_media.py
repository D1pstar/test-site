"""add site_content and media

Revision ID: b2e7f1a93c10
Revises: a1d9c0e47b52
Create Date: 2026-10-07 13:40:00

"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "b2e7f1a93c10"
down_revision: str | None = "a1d9c0e47b52"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "site_content",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("draft_json", sa.Text(), nullable=True),
        sa.Column("published_json", sa.Text(), nullable=True),
        sa.Column("draft_updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "media",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("stored_name", sa.String(length=64), nullable=False),
        sa.Column("original_name", sa.String(length=200), nullable=False),
        sa.Column("mime", sa.String(length=40), nullable=False),
        sa.Column("size", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("stored_name"),
    )


def downgrade() -> None:
    op.drop_table("media")
    op.drop_table("site_content")
