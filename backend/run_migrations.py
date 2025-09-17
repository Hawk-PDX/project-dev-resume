#!/usr/bin/env python3
"""
Production migration and data population script
This runs database migrations and populates initial data
"""

from app import create_app, db
from app.models import Project, Skill
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
    try:
        # Check if github_account column exists (PostgreSQL version)
        result = db.session.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='project' AND column_name='github_account'
        """)
        
        if result.fetchone() is None:
            print("Adding github_account column to project table...")
            db.session.execute("ALTER TABLE project ADD COLUMN github_account VARCHAR(100)")
            db.session.commit()
            print("✅ Added github_account column")
        else:
            print("✅ github_account column already exists")
            
        return True
    except Exception as e:
        print(f"❌ Failed to add columns: {e}")
        return False

def populate_sample_data():
    """Add sample projects to the database"""
    try:
        # Check if we already have projects
        existing_count = Project.query.count()
        if existing_count > 0:
            print(f"Database already has {existing_count} projects, skipping sample data")
            return True
        
        sample_projects = [
            {
                'title': 'NEO Tracker',
                'description': 'A Next.js application for tracking Near Earth Objects using NASA\'s API with real-time data visualization and hazard detection.',
                'technologies': 'Next.js, TypeScript, Tailwind CSS, NASA API, Render.com, React Icons',
                'github_url': 'https://github.com/Hawk-PDX/neo-tracker',
                'github_account': 'Hawk-PDX',
                'live_url': 'https://neo-tracker.onrender.com',
                'featured': True,
                'order': 1
            },
            {
                'title': 'Full-Stack Portfolio Application',
                'description': 'Modern portfolio website built with React frontend and Flask backend, featuring project management, skill tracking, and GitHub integration.',
                'technologies': 'React, Flask, Python, PostgreSQL, Docker, Render.com, GitHub API',
                'github_url': 'https://github.com/Hawk-PDX/project-dev-resume',
                'github_account': 'Hawk-PDX',
                'live_url': 'https://portfolio-frontend-zhcd.onrender.com',
                'featured': True,
                'order': 2
            }
        ]
        
        for project_data in sample_projects:
            project = Project(**project_data)
            db.session.add(project)
        
        db.session.commit()
        print(f"✅ Added {len(sample_projects)} sample projects")
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
        
        print(f"📊 Final database state:")
        print(f"  Projects: {project_count}")
        print(f"  Skills: {skill_count}")
        
        print("\n🎉 Production setup complete!")

if __name__ == '__main__':
    main()