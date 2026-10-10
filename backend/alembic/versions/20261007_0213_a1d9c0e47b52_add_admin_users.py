"""add admin_users

Revision ID: a1d9c0e47b52
Revises: 041c23aaab17
Create Date: 2026-10-07 02:13:00

"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "a1d9c0e47b52"
down_revision: str | None = "041c23aaab17"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=64), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("admin_users") as batch:
        batch.create_index("ix_admin_users_username", ["username"], unique=True)


def downgrade() -> None:
    with op.batch_alter_table("admin_users") as batch:
        batch.drop_index("ix_admin_users_username")
    op.drop_table("admin_users")
