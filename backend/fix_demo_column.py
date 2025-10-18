#!/usr/bin/env python3
"""
Emergency fix script to add the demo column to production database
Run this script directly on production to fix the missing column issue
"""

from app import create_app, db
from sqlalchemy import text
import os

def fix_demo_column():
    """Add the missing demo column to the project table"""
    try:
        app = create_app()
        
        with app.app_context():
            print("🔧 Checking for demo column in project table...")
            
            # Check if demo column exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='project' AND column_name='demo'
            """))
            
            if result.fetchone() is None:
                print("❌ Demo column not found. Adding it now...")
                
                # Add the demo column
                db.session.execute(text("ALTER TABLE project ADD COLUMN demo BOOLEAN DEFAULT FALSE"))
                
                # Update existing projects to set demo=false (they're real projects)
                db.session.execute(text("UPDATE project SET demo = FALSE WHERE demo IS NULL"))
                
                db.session.commit()
                print("✅ Successfully added demo column with DEFAULT FALSE")
                print("✅ Updated existing projects to demo=FALSE")
                
                # Verify the column was added
                result = db.session.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='project' AND column_name='demo'
                """))
                
                if result.fetchone():
                    print("✅ Verification: demo column exists in database")
                else:
                    print("❌ Verification failed: demo column still missing")
                    
            else:
                print("✅ Demo column already exists")
                
            # Test a query to make sure it works
            from app.models import Project
            count = Project.query.count()
            print(f"✅ Test query successful: Found {count} projects")
            
            return True
            
    except Exception as e:
        print(f"❌ Error fixing demo column: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🚀 Starting demo column fix...")
    success = fix_demo_column()
    if success:
        print("🎉 Demo column fix completed successfully!")
    else:
        print("💥 Demo column fix failed!")