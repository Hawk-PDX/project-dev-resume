"""Set demo false for all projects

Revision ID: 906035d34447
Revises: 905035d34447
Create Date: 2025-10-11 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '906035d34447'
down_revision = '905035d34447'
branch_labels = None
depends_on = None


def upgrade():
    # Set demo = false for all existing projects
    op.execute("UPDATE project SET demo = false WHERE demo = true")


def downgrade():
    # No downgrade needed, as this is a one-way data fix
    pass
