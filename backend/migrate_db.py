#!/usr/bin/env python3

"""
Database migration script to add missing columns to existing tables.
Run this when deploying updates that add new model fields.
"""

from app import create_app, db
from sqlalchemy import text, inspect
import sys

app = create_app()

def migrate_database():
    """Add any missing columns to existing tables."""
    with app.app_context():
        try:
            print('🔄 Starting database migration...')
            
            # Check if github_account column exists in project table
            inspector = inspect(db.engine)
            project_columns = [col['name'] for col in inspector.get_columns('project')]
            
            if 'github_account' not in project_columns:
                print('➕ Adding missing github_account column to project table...')
                db.session.execute(text('''
                    ALTER TABLE project ADD COLUMN github_account VARCHAR(100);
                '''))
                db.session.commit()
                print('✅ Successfully added github_account column')
            else:
                print('✅ github_account column already exists')
            
            # Add any other missing columns here as needed
            # Example for future migrations:
            # if 'new_column' not in project_columns:
            #     db.session.execute(text('ALTER TABLE project ADD COLUMN new_column VARCHAR(100);'))
            
            print('🎉 Database migration completed successfully!')
            return True
            
        except Exception as e:
            print(f'❌ Database migration failed: {e}')
            db.session.rollback()
            return False

if __name__ == '__main__':
    success = migrate_database()
    sys.exit(0 if success else 1)