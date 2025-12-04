#!/usr/bin/env python3
"""
Quick script to update the GitHub URL in the database to use correct capitalization
"""

from app import create_app, db
from app.models import PersonalInfo

def update_github_url():
    """Update GitHub URL to correct account (Hawk-PDX not hawkpdx)"""
    app = create_app()
    
    with app.app_context():
        try:
            # Get the personal info record
            personal_info = PersonalInfo.query.first()
            
            if not personal_info:
                print("❌ No personal info found in database")
                return
            
            # Show current value
            print(f"Current GitHub URL: {personal_info.github}")
            
            # Update to correct URL with proper capitalization
            personal_info.github = 'https://github.com/Hawk-PDX'
            
            # Commit the change
            db.session.commit()
            
            print(f"✅ GitHub URL updated to: {personal_info.github}")
            
        except Exception as e:
            print(f"❌ Error updating GitHub URL: {e}")
            db.session.rollback()

if __name__ == "__main__":
    update_github_url()
