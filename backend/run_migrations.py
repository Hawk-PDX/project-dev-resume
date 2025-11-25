#!/usr/bin/env python3
"""
Production migration and data population script
This runs database migrations and populates initial data
"""

from app import create_app, db
from app.models import Project, Skill, Certificate
from datetime import date
from flask_migrate import upgrade
import os

def run_migrations():
    """Run any pending database migrations"""
    try:
        upgrade()
        print("✅ Database migrations completed successfully")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def add_missing_columns():
    """Manually add missing columns if migrations fail"""
    from sqlalchemy import text
    try:
        # Check if github_account column exists (PostgreSQL version)
        result = db.session.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='project' AND column_name='github_account'
        """))
        
        if result.fetchone() is None:
            print("Adding github_account column to project table...")
            db.session.execute(text("ALTER TABLE project ADD COLUMN github_account VARCHAR(100)"))
            db.session.commit()
            print("✅ Added github_account column")
        else:
            print("✅ github_account column already exists")
        
        
        # Check if photo_url column exists in certificate table
        result = db.session.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='certificate' AND column_name='photo_url'
        """))
        
        if result.fetchone() is None:
            print("Adding photo_url column to certificate table...")
            db.session.execute(text("ALTER TABLE certificate ADD COLUMN photo_url VARCHAR(500)"))
            db.session.commit()
            print("✅ Added photo_url column")
        else:
            print("✅ photo_url column already exists")
            
        return True
    except Exception as e:
        print(f"❌ Failed to add columns: {e}")
        return False

def populate_sample_data():
    """Add sample projects and certificates to the database"""
    try:
        # Check if we already have projects
        existing_count = Project.query.count()
        if existing_count > 0:
            print(f"Database already has {existing_count} projects, skipping sample data")
            return True

        sample_projects = [
            {
                'title': 'FS Software Developer Portfolio',
                'description': 'Resume template for aspiring full-stack software developers',
                'technologies': 'JavaScript, React, Python, Flask, PostgreSQL',
                'github_url': 'https://github.com/Hawk-PDX/project-dev-resume.git',
                'github_account': 'Hawk-PDX',
                'live_url': '',
                'featured': True,
                'order': 1
            },
            {
                'title': 'HuntSafe',
                'description': 'A React Native hunting safety app with real-time location sharing and emergency alerts for hunting groups in remote areas.',
                'technologies': 'React Native + Expo, Node.js + Express, Socket.IO, PostgreSQL',
                'github_url': 'https://github.com/Hawk-PDX/hunting-comm-app',
                'github_account': 'Hawk-PDX',
                'live_url': '',
                'featured': True,
                'order': 2
            },
            {
                'title': 'PDX Underground',
                'description': 'Python CLI-based RPG',
                'technologies': 'Python',
                'github_url': 'https://github.com/Hawk-PDX/python_final_project.git',
                'github_account': 'Hawk-PDX',
                'live_url': '',
                'featured': True,
                'order': 3
            }
        ]

        for project_data in sample_projects:
            project = Project(**project_data)
            db.session.add(project)

        # Add sample certificate
        sample_certificate = Certificate(
            entity='Scrimba',
            course='React Development',
            topics='React, JavaScript',
            description='Advanced React development course covering modern React patterns and best practices.',
            credit_hrs=None,
            issue_date=date(2024, 1, 15),
            expiry_date=None,
            credential_id='XYZ789',
            credential_url=None,
            photo_url=None,
            order=1
        )
        db.session.add(sample_certificate)

        db.session.commit()
        print(f"✅ Added {len(sample_projects)} sample projects and 1 sample certificate")
        return True

    except Exception as e:
        print(f"❌ Failed to add sample data: {e}")
        db.session.rollback()
        return False

def main():
    print("🚀 Starting production setup...")
    
    app = create_app()
    
    with app.app_context():
        print("\n1️⃣ Running database migrations...")
        migrations_success = run_migrations()
        
        if not migrations_success:
            print("\n2️⃣ Attempting manual column addition...")
            add_missing_columns()
        
        print("\n3️⃣ Populating sample data...")
        populate_sample_data()
        
        print("\n4️⃣ Checking final state...")
        project_count = Project.query.count()
        skill_count = Skill.query.count()
        certificate_count = Certificate.query.count()

        print(f"📊 Final database state:")
        print(f"  Projects: {project_count}")
        print(f"  Skills: {skill_count}")
        print(f"  Certificates: {certificate_count}")
        
        print("\n🎉 Production setup complete!")

if __name__ == '__main__':
    main()