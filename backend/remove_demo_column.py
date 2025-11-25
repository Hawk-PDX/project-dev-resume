#!/usr/bin/env python3
"""
Migration script to remove the demo column from the project table.
"""

from app import create_app, db
from sqlalchemy import text
import sys

def remove_demo_column():
    """Remove the demo column from the project table"""
    try:
        app = create_app()
        
        with app.app_context():
            print("Checking for demo column in project table...")
            
            # Check if demo column exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='project' AND column_name='demo'
            """))
            
            if result.fetchone() is not None:
                print("Demo column found. Removing...")
                
                # Drop the demo column
                db.session.execute(text("ALTER TABLE project DROP COLUMN IF EXISTS demo"))
                
                db.session.commit()
                print("Successfully removed demo column")
                
                # Verify the column was removed
                result = db.session.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='project' AND column_name='demo'
                """))
                
                if result.fetchone() is None:
                    print("Verified: demo column removed")
                else:
                    print("Error: demo column still exists")
                    return False
                    
            else:
                print("Demo column does not exist (already removed)")
                
            # Test a query to make sure it works
            from app.models import Project
            count = Project.query.count()
            print(f"Test query successful: {count} projects found")
            
            return True
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("Starting migration...\n")
    success = remove_demo_column()
    if success:
        print("\nMigration completed successfully")
        sys.exit(0)
    else:
        print("\nMigration failed")
        sys.exit(1)
