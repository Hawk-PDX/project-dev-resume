"""
Skill calculation service that implements a hybrid approach:
- Auto-calculates base skill levels from project data
- Allows manual overrides for professional control
- Categorizes skills intelligently
- Provides skill synchronization capabilities
"""

from app.models import Project, Skill
from app import db
from sqlalchemy import func
import re
from datetime import datetime, timedelta

class SkillCalculator:
    """
    Hybrid skill calculation system that combines project analysis with manual control
    """
    
    # Technology categorization mapping
    SKILL_CATEGORIES = {
        'frontend': [
            'react', 'vue', 'vue.js', 'angular', 'javascript', 'typescript', 'js', 'ts',
            'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 'tailwind css',
            'bootstrap', 'material-ui', 'styled-components', 'next.js', 'nextjs', 'nuxt.js',
            'svelte', 'jquery', 'webpack', 'vite', 'parcel', 'rollup'
        ],
        'backend': [
            'python', 'flask', 'django', 'fastapi', 'node.js', 'nodejs', 'express', 'express.js',
            'java', 'spring', 'spring boot', 'c#', 'asp.net', '.net', 'ruby', 'rails',
            'php', 'laravel', 'symfony', 'go', 'golang', 'rust', 'kotlin', 'scala',
            'restful apis', 'rest api', 'graphql', 'api', 'microservices'
        ],
        'database': [
            'postgresql', 'postgres', 'mysql', 'mongodb', 'sqlite', 'redis', 'elasticsearch',
            'cassandra', 'dynamodb', 'mariadb', 'oracle', 'sql server', 'firebase',
            'supabase', 'prisma', 'mongoose', 'sequelize', 'typeorm', 'sqlalchemy'
        ],
        'tools': [
            'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'aws', 'azure',
            'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'linux',
            'ubuntu', 'nginx', 'apache', 'ci/cd', 'jenkins', 'github actions', 'gitlab ci',
            'terraform', 'ansible', 'vagrant', 'vim', 'vscode', 'intellij', 'postman',
            'figma', 'adobe', 'jira', 'confluence', 'slack', 'notion'
        ],
        'mobile': [
            'react native', 'flutter', 'ionic', 'cordova', 'swift', 'kotlin', 'java',
            'objective-c', 'xamarin', 'unity', 'unreal engine'
        ],
        'data': [
            'pandas', 'numpy', 'matplotlib', 'seaborn', 'scikit-learn', 'tensorflow',
            'pytorch', 'jupyter', 'r', 'tableau', 'power bi', 'excel', 'sql',
            'apache spark', 'hadoop', 'airflow', 'kafka'
        ]
    }
    
    @classmethod
    def categorize_technology(cls, tech_name):
        """
        Determine the category of a technology based on its name
        """
        tech_lower = tech_name.lower().strip()
        
        for category, technologies in cls.SKILL_CATEGORIES.items():
            if tech_lower in technologies:
                return category
        
        # Default to tools if no specific category found
        return 'tools'
    
    @classmethod
    def extract_technologies_from_projects(cls):
        """
        Extract all unique technologies from project data
        Returns dict with technology counts and metadata
        """
        projects = Project.query.all()
        tech_data = {}
        
        for project in projects:
            if project.technologies:
                # Split technologies and clean them
                techs = [tech.strip() for tech in project.technologies.split(',')]
                
                for tech in techs:
                    if tech:  # Skip empty strings
                        tech_clean = tech.lower().strip()
                        
                        if tech_clean not in tech_data:
                            tech_data[tech_clean] = {
                                'name': tech,  # Keep original casing
                                'count': 0,
                                'projects': [],
                                'featured_projects': 0,
                                'category': cls.categorize_technology(tech_clean)
                            }
                        
                        tech_data[tech_clean]['count'] += 1
                        tech_data[tech_clean]['projects'].append({
                            'id': project.id,
                            'title': project.title,
                            'featured': project.featured
                        })
                        
                        if project.featured:
                            tech_data[tech_clean]['featured_projects'] += 1
        
        return tech_data
    
    @classmethod
    def calculate_skill_level(cls, tech_data, max_count):
        """
        Calculate skill level based on usage data and other factors
        Uses a 1-5 scale with intelligent weighting
        """
        count = tech_data['count']
        featured_bonus = tech_data['featured_projects'] * 0.5
        
        # Base calculation: logarithmic scale for better distribution
        if count == 0:
            base_level = 1
        elif count == 1:
            base_level = 2
        elif count == 2:
            base_level = 3
        elif count >= 3:
            base_level = 4
        
        # Featured project bonus (up to 1 additional point)
        bonus = min(1.0, featured_bonus)
        
        # Calculate final level
        final_level = min(5, base_level + bonus)
        
        return round(final_level)
    
    @classmethod
    def auto_generate_skills(cls):
        """
        Auto-generate skills from project data
        Returns list of calculated skills
        """
        tech_data = cls.extract_technologies_from_projects()
        
        if not tech_data:
            return []
        
        max_count = max(data['count'] for data in tech_data.values())
        calculated_skills = []
        
        # Sort by count and category for consistent ordering
        sorted_techs = sorted(
            tech_data.items(),
            key=lambda x: (x[1]['category'], -x[1]['count'], x[0])
        )
        
        order_counters = {'frontend': 100, 'backend': 100, 'database': 100, 'tools': 100, 'mobile': 100, 'data': 100}
        
        for tech_key, data in sorted_techs:
            level = cls.calculate_skill_level(data, max_count)
            category = data['category']
            
            calculated_skills.append({
                'name': data['name'],
                'category': category,
                'level': level,
                'order': order_counters[category],
                'project_count': data['count'],
                'featured_count': data['featured_projects'],
                'auto_calculated': True
            })
            
            order_counters[category] -= 1
        
        return calculated_skills
    
    @classmethod
    def sync_skills_with_projects(cls, preserve_manual_overrides=True):
        """
        Synchronize skills with current project data
        
        Args:
            preserve_manual_overrides: If True, keeps manually set skill levels
        
        Returns:
            dict: Summary of sync operation
        """
        calculated_skills = cls.auto_generate_skills()
        
        if not calculated_skills:
            return {'status': 'no_projects', 'message': 'No projects found to calculate skills from'}
        
        # Get existing skills
        existing_skills = {skill.name.lower(): skill for skill in Skill.query.all()}
        
        added = 0
        updated = 0
        preserved = 0
        
        for skill_data in calculated_skills:
            skill_name_lower = skill_data['name'].lower()
            
            if skill_name_lower in existing_skills:
                # Update existing skill
                existing_skill = existing_skills[skill_name_lower]
                
                # Check if it's manually overridden (has different level than calculated)
                if preserve_manual_overrides and hasattr(existing_skill, 'manual_override'):
                    if getattr(existing_skill, 'manual_override', False):
                        preserved += 1
                        continue
                
                # Update non-manual skills
                existing_skill.category = skill_data['category']
                existing_skill.order = skill_data['order']
                
                # Safely update optional columns that might not exist in older databases
                if hasattr(existing_skill, 'auto_calculated_level'):
                    existing_skill.auto_calculated_level = skill_data['level']
                if hasattr(existing_skill, 'project_count'):
                    existing_skill.project_count = skill_data['project_count']
                if hasattr(existing_skill, 'last_calculated'):
                    existing_skill.last_calculated = datetime.utcnow()
                
                # Only update level if preserve_manual_overrides is False or skill is not manually overridden
                manual_override = getattr(existing_skill, 'manual_override', False)
                if not preserve_manual_overrides or not manual_override:
                    existing_skill.level = skill_data['level']
                
                updated += 1
            else:
                # Add new skill with safe column handling
                skill_kwargs = {
                    'name': skill_data['name'],
                    'category': skill_data['category'],
                    'level': skill_data['level'],
                    'order': skill_data['order']
                }
                
                # Add optional columns if they exist in the model
                if hasattr(Skill, 'auto_calculated_level'):
                    skill_kwargs['auto_calculated_level'] = skill_data['level']
                if hasattr(Skill, 'project_count'):
                    skill_kwargs['project_count'] = skill_data['project_count']
                if hasattr(Skill, 'manual_override'):
                    skill_kwargs['manual_override'] = False
                if hasattr(Skill, 'last_calculated'):
                    skill_kwargs['last_calculated'] = datetime.utcnow()
                
                new_skill = Skill(**skill_kwargs)
                db.session.add(new_skill)
                added += 1
        
        try:
            db.session.commit()
            
            return {
                'status': 'success',
                'added': added,
                'updated': updated,
                'preserved': preserved,
                'total_calculated': len(calculated_skills)
            }
        except Exception as e:
            db.session.rollback()
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @classmethod
    def get_skill_insights(cls):
        """
        Get insights about current skills and project alignment
        """
        tech_data = cls.extract_technologies_from_projects()
        existing_skills = Skill.query.all()
        
        # Technologies in projects but not in skills
        project_techs = set(data['name'].lower() for data in tech_data.values())
        skill_names = set(skill.name.lower() for skill in existing_skills)
        
        missing_skills = project_techs - skill_names
        unused_skills = skill_names - project_techs
        
        return {
            'total_projects': Project.query.count(),
            'total_technologies': len(tech_data),
            'total_skills': len(existing_skills),
            'missing_skills': list(missing_skills),
            'unused_skills': list(unused_skills),
            'project_tech_distribution': {
                cat: len([t for t in tech_data.values() if t['category'] == cat])
                for cat in cls.SKILL_CATEGORIES.keys()
            }
        }