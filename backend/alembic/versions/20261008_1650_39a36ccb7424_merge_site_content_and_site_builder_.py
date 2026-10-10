"""merge site_content and site_builder branches

Revision ID: 39a36ccb7424
Revises: b2e7f1a93c10, 6f3b0d4a91f2
Create Date: 2026-10-08 16:50:17.111449

"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '39a36ccb7424'
down_revision: str | None = ('b2e7f1a93c10', '6f3b0d4a91f2')
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass