"""baseline placeholder.

Tables for a fresh database are created by bootstrap.py. If you already have your
own original migration with revision 041c23aaab17, DELETE THIS FILE and keep yours
(two files with the same revision id make alembic fail).
"""
revision = "041c23aaab17"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
