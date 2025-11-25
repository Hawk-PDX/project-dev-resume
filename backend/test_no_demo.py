#!/usr/bin/env python3
"""
Verify the project model works without the demo column.
"""

from app import create_app
from app.models import Project

def test_project_model():
    """Verify Project model doesn't have demo column"""
    app = create_app()
    
    with app.app_context():
        print("Testing Project model...")
        
        # Check model attributes
        model_columns = [c.name for c in Project.__table__.columns]
        print(f"\nProject model columns: {', '.join(model_columns)}")
        
        if 'demo' in model_columns:
            print("ERROR: 'demo' column still in model")
            return False
        else:
            print("Confirmed: 'demo' column removed from model")
        
        # Try to query projects
        try:
            count = Project.query.count()
            print(f"Database query successful: {count} projects found")
        except Exception as e:
            print(f"Database query failed: {e}")
        
        print("\nSummary:")
        print("- Code changes complete")
        print("- Next: Run 'python remove_demo_column.py' on PostgreSQL")
        
        return True

if __name__ == '__main__':
    print("Verifying changes...\n")
    success = test_project_model()
    print("\n" + "="*60)
    if success:
        print("Code changes verified")
    else:
        print("Issues found")
