"""Add photo_url to certificates

Revision ID: 1ae0a701676b
Revises: d69802d7dbc5
Create Date: 2025-10-18 16:50:39.529406

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ae0a701676b'
down_revision = 'd69802d7dbc5'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('certificate', sa.Column('photo_url', sa.String(length=500), nullable=True))


def downgrade():
    op.drop_column('certificate', 'photo_url')
