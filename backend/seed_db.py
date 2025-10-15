#!/usr/bin/env python3
"""
Database seeding script for production deployment.
Run this script to populate the production database with your development data.
"""

from app import create_app, db
from app.models import PersonalInfo, Experience, Education, Certificate, Project, Skill
from datetime import datetime, date
import sys

def seed_database():
    """Seed database with development data"""
    app = create_app()

    with app.app_context():
        try:
            # Check if data already exists to preserve production data
            existing_projects = Project.query.count()
            if existing_projects > 0:
                print(f"Database already has {existing_projects} projects. Updating missing or incorrect data instead of clearing.")
                # Update existing projects to ensure HuntSafe is featured
                update_existing_projects()
                return

            # Clear existing data (optional - comment out if you want to preserve existing data)
            print("Clearing existing data...")
            try:
                db.session.query(PersonalInfo).delete()
                db.session.query(Experience).delete()
                db.session.query(Education).delete()
                db.session.query(Project).delete()
                db.session.query(Skill).delete()
                # Only delete certificates if the table exists
                try:
                    db.session.query(Certificate).delete()
                except Exception as cert_error:
                    print(f"Note: Certificate table not available: {cert_error}")
                db.session.commit()
                print("✅ Existing data cleared")
            except Exception as clear_error:
                print(f"⚠️ Error clearing data: {clear_error}")
                db.session.rollback()
            
            # Seed Personal Information
            print("Seeding personal information...")
            personal_info = PersonalInfo(
                name='Garrett Hawkins',
                title='Full Stack Developer',
                email='hawkpdx@icloud.com',
                phone=None,
                location='Portland, Oregon',
                linkedin='https://linkedin.com/in/hawkpdx',
                github='https://github.com/HawkPDX',
                website='https://rosecitydev.tech',
                summary='Passionate full-stack developer with expertise in React, Python, and Flask. Experienced in building scalable web applications and passionate about clean code and user experience.'
            )
            db.session.add(personal_info)
            
            # Seed Projects (your real projects)
            print("Seeding projects...")
            projects_data = [
                {
                    'title': 'FS Software Developer Portfolio',
                    'description': 'Resume template for aspiring full-stack software developers',
                    'technologies': 'JavaScript, React, Python, Flask, PostgreSQL',
                    'github_url': 'https://github.com/Hawk-PDX/project-dev-resume.git',
                    'github_account': 'Hawk-PDX',
                    'live_url': '',
                    'image_url': '',
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
                    'image_url': '',
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
                    'image_url': '',
                    'featured': True,
                    'order': 3
                }
            ]
            
            for project_data in projects_data:
                project = Project(**project_data)
                db.session.add(project)
            
            # Seed Experience (sample data - replace with your real experience)
            print("Seeding experience...")
            experience = Experience(
                company='Tech Solutions Inc.',
                position='Full Stack Developer',
                start_date=date(2023, 1, 1),
                end_date=None,
                current=True,
                description='Developed and maintained full-stack web applications using React and Flask. Led the migration of legacy systems to modern cloud infrastructure.',
                technologies='React, Python, Flask, PostgreSQL, Docker',
                achievements='• Increased application performance by 40%\n• Led team of 3 developers\n• Implemented CI/CD pipeline reducing deployment time by 60%',
                order=1
            )
            db.session.add(experience)
            
            # Seed Education (sample data - replace with your real education)
            print("Seeding education...")
            education = Education(
                institution='University of Technology',
                degree='Bachelor of Science',
                field='Computer Science',
                start_date=date(2019, 9, 1),
                end_date=date(2023, 5, 1),
                gpa=3.8,
                description='Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems',
                order=1
            )
            db.session.add(education)
            
            # Seed Certificate (your real certificate)
            print("Seeding certificates...")
            try:
                certificate = Certificate(
                    entity='Udemy',
                    course='React Development',
                    topics='React JavaScript',
                    description='Advanced React development course',
                    credit_hrs=None,
                    issue_date=date(2024, 1, 15),
                    expiry_date=None,
                    credential_id='XYZ789',
                    credential_url=None,
                    order=1
                )
                db.session.add(certificate)
                print("✅ Certificates seeded successfully")
            except Exception as cert_error:
                print(f"⚠️ Certificate seeding failed: {cert_error}")
                print("Continuing without certificates...")
            
            # Seed Skills (matching your local database exactly)
            print("Seeding skills...")
            skills_data = [
                # Backend (matching your local data)
                {'name': 'Python', 'level': 4, 'category': 'backend', 'order': 100},
                {'name': 'Flask', 'level': 2, 'category': 'backend', 'order': 99},
                {'name': 'Django', 'level': 3, 'category': 'backend', 'order': 8},
                {'name': 'Node.js', 'level': 4, 'category': 'backend', 'order': 7},
                {'name': 'Express', 'level': 4, 'category': 'backend', 'order': 6},
                {'name': 'RESTful APIs', 'level': 5, 'category': 'backend', 'order': 5},
                
                # Database (matching your local data)
                {'name': 'PostgreSQL', 'level': 2, 'category': 'database', 'order': 100},
                {'name': 'MySQL', 'level': 4, 'category': 'database', 'order': 9},
                {'name': 'SQLite', 'level': 5, 'category': 'database', 'order': 8},
                {'name': 'MongoDB', 'level': 3, 'category': 'database', 'order': 7},
                {'name': 'Redis', 'level': 3, 'category': 'database', 'order': 6},
                
                # Frontend (matching your local data)
                {'name': 'JavaScript', 'level': 2, 'category': 'frontend', 'order': 100},
                {'name': 'React', 'level': 2, 'category': 'frontend', 'order': 99},
                {'name': 'TypeScript', 'level': 4, 'category': 'frontend', 'order': 8},
                {'name': 'HTML5', 'level': 5, 'category': 'frontend', 'order': 7},
                {'name': 'CSS3', 'level': 5, 'category': 'frontend', 'order': 6},
                {'name': 'Tailwind CSS', 'level': 4, 'category': 'frontend', 'order': 5},
                {'name': 'Vue.js', 'level': 3, 'category': 'frontend', 'order': 4},
                
                # Tools (matching your local data)
                {'name': 'Git', 'level': 5, 'category': 'tools', 'order': 10},
                {'name': 'Linux', 'level': 4, 'category': 'tools', 'order': 9},
                {'name': 'CI/CD', 'level': 4, 'category': 'tools', 'order': 8},
                {'name': 'AWS', 'level': 3, 'category': 'tools', 'order': 7},
            ]
            
            for skill_data in skills_data:
                skill = Skill(**skill_data)
                db.session.add(skill)
            
            # Commit all changes
            db.session.commit()
            print("✅ Database seeded successfully!")
            
        except Exception as e:
            print(f"❌ Error seeding database: {e}")
            db.session.rollback()
            sys.exit(1)

def update_existing_projects():
    """Update existing projects to ensure HuntSafe is featured and properly ordered"""
    try:
        # Find HuntSafe project
        huntsafe = Project.query.filter_by(title='HuntSafe').first()
        if huntsafe:
            huntsafe.featured = True
            huntsafe.order = 2
            print("✅ Updated HuntSafe to be featured")
        else:
            print("⚠️ HuntSafe project not found, will be created on next full seed")

        # Ensure other projects have correct featured status
        portfolio = Project.query.filter_by(title='FS Software Developer Portfolio').first()
        if portfolio:
            portfolio.featured = True
            portfolio.order = 1

        pdx = Project.query.filter_by(title='PDX Underground').first()
        if pdx:
            pdx.featured = True
            pdx.order = 3

        db.session.commit()
        print("✅ Existing projects updated successfully")

    except Exception as e:
        print(f"❌ Error updating existing projects: {e}")
        db.session.rollback()

if __name__ == '__main__':
    seed_database()
