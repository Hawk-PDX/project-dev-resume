#!/usr/bin/env python3
"""
Database population script for production deployment
This script populates the database with your personal projects and skills
"""

import requests
import json
import time

# Your production API base URL
API_BASE = "https://portfolio-backend-skva.onrender.com/api"

def populate_projects():
    """Populate database with your actual projects"""
    
    projects = [
        {
            "title": "NEO Tracker",
            "description": "A Next.js application for tracking Near Earth Objects using NASA's API with real-time data visualization and hazard detection.",
            "technologies": "Next.js, TypeScript, Tailwind CSS, NASA API, Render.com, React Icons",
            "github_url": "https://github.com/Hawk-PDX/neo-tracker",
            "github_account": "Hawk-PDX",
            "live_url": "https://neo-tracker.onrender.com",
            "featured": True,
            "order": 1
        },
        {
            "title": "Full-Stack Portfolio Application",
            "description": "Modern portfolio website built with React frontend and Flask backend, featuring project management, skill tracking, and GitHub integration.",
            "technologies": "React, Flask, Python, PostgreSQL, Docker, Render.com, GitHub API",
            "github_url": "https://github.com/Hawk-PDX/project-dev-resume",
            "github_account": "Hawk-PDX", 
            "live_url": "https://portfolio-frontend-zhcd.onrender.com",
            "featured": True,
            "order": 2
        },
        {
            "title": "Crypto Trading Bot",
            "description": "Automated cryptocurrency trading bot with real-time market analysis and risk management features.",
            "technologies": "Python, APIs, Data Analysis, Algorithmic Trading",
            "github_url": "https://github.com/Hawk-PDX/cryptoBot",
            "github_account": "Hawk-PDX",
            "featured": False,
            "order": 3
        },
        {
            "title": "Tri-County Membership Manager", 
            "description": "Membership management system for organizational tracking and administration.",
            "technologies": "Database Management, User Administration, Web Development",
            "github_url": "https://github.com/Hawk-PDX/Tri-County-Membership-Manager",
            "github_account": "Hawk-PDX",
            "featured": False,
            "order": 4
        }
    ]
    
    created = []
    for project in projects:
        try:
            response = requests.post(f"{API_BASE}/projects/", json=project, timeout=30)
            if response.status_code in [200, 201]:
                created.append(project["title"])
                print(f"✅ Created project: {project['title']}")
            else:
                print(f"❌ Failed to create {project['title']}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Error creating {project['title']}: {str(e)}")
        
        time.sleep(1)  # Rate limiting
    
    return created

def populate_skills():
    """Trigger skill calculation from projects"""
    try:
        response = requests.post(f"{API_BASE}/skills/calculate", json={}, timeout=30)
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Skills calculated: {result}")
            return True
        else:
            print(f"❌ Failed to calculate skills: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error calculating skills: {str(e)}")
        return False

def check_current_data():
    """Check what's currently in the database"""
    try:
        # Check projects
        response = requests.get(f"{API_BASE}/projects/", timeout=10)
        if response.status_code == 200:
            projects = response.json()
            print(f"📊 Current projects in database: {len(projects)}")
            for project in projects[:3]:  # Show first 3
                print(f"  - {project.get('title', 'Unknown')}")
        else:
            print(f"❌ Cannot fetch projects: {response.status_code}")
            
        # Check skills
        response = requests.get(f"{API_BASE}/skills/", timeout=10)
        if response.status_code == 200:
            skills = response.json()
            total_skills = sum(len(category_skills) for category_skills in skills.values())
            print(f"📊 Current skills in database: {total_skills}")
        else:
            print(f"❌ Cannot fetch skills: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error checking data: {str(e)}")

def main():
    print("🚀 Starting database population...")
    print(f"🎯 Target API: {API_BASE}")
    
    # Check current state
    print("\n1️⃣ Checking current database state...")
    check_current_data()
    
    # Populate projects
    print("\n2️⃣ Populating projects...")
    created_projects = populate_projects()
    
    if created_projects:
        print(f"\n✅ Successfully created {len(created_projects)} projects:")
        for project in created_projects:
            print(f"  • {project}")
        
        # Wait a bit for database to sync
        print("\n⏱️  Waiting for database sync...")
        time.sleep(3)
        
        # Calculate skills from projects
        print("\n3️⃣ Calculating skills from projects...")
        if populate_skills():
            print("✅ Skills calculation completed!")
        else:
            print("❌ Skills calculation failed")
    else:
        print("\n❌ No projects were created. Check the API endpoints.")
    
    # Final check
    print("\n4️⃣ Final database state:")
    check_current_data()
    
    print("\n🎉 Database population complete!")
    print("🔄 Your frontend should now show the updated data!")

if __name__ == "__main__":
    main()