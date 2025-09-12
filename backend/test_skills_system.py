#!/usr/bin/env python3
"""
Test script for the hybrid skills calculation system
"""

from app import create_app, db
from app.services.skill_calculator import SkillCalculator
from app.models import Project, Skill

def test_skills_system():
    """Test the hybrid skills calculation system"""
    app = create_app()
    
    with app.app_context():
        print("🔍 Testing Skills Calculation System")
        print("=" * 50)
        
        # Test 1: Extract technologies from projects
        print("1. Extracting technologies from projects...")
        tech_data = SkillCalculator.extract_technologies_from_projects()
        print(f"   Found {len(tech_data)} unique technologies:")
        
        for tech_name, data in tech_data.items():
            print(f"   • {data['name']} ({data['category']}): {data['count']} project(s), {data['featured_projects']} featured")
        
        # Test 2: Generate calculated skills
        print("\n2. Generating calculated skills...")
        calculated_skills = SkillCalculator.auto_generate_skills()
        print(f"   Generated {len(calculated_skills)} skills:")
        
        skills_by_category = {}
        for skill in calculated_skills:
            cat = skill['category']
            if cat not in skills_by_category:
                skills_by_category[cat] = []
            skills_by_category[cat].append(skill)
        
        for category, skills in skills_by_category.items():
            print(f"   {category.title()}:")
            for skill in skills:
                print(f"     • {skill['name']}: Level {skill['level']}/5 ({skill['project_count']} projects)")
        
        # Test 3: Sync with database
        print("\n3. Syncing skills with database...")
        sync_result = SkillCalculator.sync_skills_with_projects()
        print(f"   Sync result: {sync_result}")
        
        # Test 4: Check final database state
        print("\n4. Final database state...")
        all_skills = Skill.query.all()
        print(f"   Total skills in database: {len(all_skills)}")
        
        db_skills_by_category = {}
        for skill in all_skills:
            if skill.category not in db_skills_by_category:
                db_skills_by_category[skill.category] = []
            db_skills_by_category[skill.category].append(skill)
        
        for category, skills in db_skills_by_category.items():
            print(f"   {category.title()}:")
            for skill in skills:
                override_text = " (Manual Override)" if skill.manual_override else ""
                print(f"     • {skill.name}: Level {skill.level}/5{override_text}")
        
        # Test 5: Get insights
        print("\n5. Skill insights...")
        insights = SkillCalculator.get_skill_insights()
        print(f"   Projects: {insights['total_projects']}")
        print(f"   Technologies: {insights['total_technologies']}")
        print(f"   Skills: {insights['total_skills']}")
        print(f"   Missing skills: {insights['missing_skills']}")
        print(f"   Unused skills: {insights['unused_skills']}")
        
        print("\n✅ Skills system test completed!")

if __name__ == '__main__':
    test_skills_system()