"""add site builder config

Revision ID: 6f3b0d4a91f2
Revises: a1d9c0e47b52
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "6f3b0d4a91f2"
down_revision = "a1d9c0e47b52"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if inspect(bind).has_table("site_config"):
        return
    op.create_table(
        "site_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("draft", sa.JSON(), nullable=False),
        sa.Column("published", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("site_config")