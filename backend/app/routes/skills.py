from flask import Blueprint, jsonify
from app.models import Skill
from app import db

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/', methods=['GET'])
def get_skills():
    skills = Skill.query.order_by(Skill.category, Skill.order.desc()).all()
    
    if not skills:
        # Return sample data
        return jsonify({
            'frontend': [
                {'name': 'React', 'level': 5, 'category': 'frontend'},
                {'name': 'JavaScript', 'level': 5, 'category': 'frontend'},
                {'name': 'TypeScript', 'level': 4, 'category': 'frontend'},
                {'name': 'HTML5', 'level': 5, 'category': 'frontend'},
                {'name': 'HTML6', 'level': 5, 'category': 'frontend'},
                {'name': 'CSS3', 'level': 5, 'category': 'frontend'},
                {'name': 'Tailwind CSS', 'level': 4, 'category': 'frontend'}
            ],
            'backend': [
                {'name': 'Python', 'level': 5, 'category': 'backend'},
                {'name': 'Flask', 'level': 5, 'category': 'backend'},
                {'name': 'Django', 'level': 3, 'category': 'backend'},
                {'name': 'Node.js', 'level': 4, 'category': 'backend'},
                {'name': 'Express', 'level': 4, 'category': 'backend'},
                {'name': 'RESTful APIs', 'level': 5, 'category': 'backend'}
            ],
            'database': [
                {'name': 'PostgreSQL', 'level': 4, 'category': 'database'},
                {'name': 'MySQL', 'level': 4, 'category': 'database'},
                {'name': 'MongoDB', 'level': 3, 'category': 'database'},
                {'name': 'Redis', 'level': 3, 'category': 'database'},
                {'name': 'SQLite', 'level': 5, 'category': 'database'}
            ],
            'tools': [
                {'name': 'Git', 'level': 5, 'category': 'tools'},
                {'name': 'AWS', 'level': 3, 'category': 'tools'},
                {'name': 'Linux', 'level': 4, 'category': 'tools'},
                {'name': 'CI/CD', 'level': 4, 'category': 'tools'}
            ]
        })
    
    # Group skills by category
    skills_by_category = {}
    for skill in skills:
        if skill.category not in skills_by_category:
            skills_by_category[skill.category] = []
        skills_by_category[skill.category].append({
            'name': skill.name,
            'level': skill.level,
            'category': skill.category
        })
    
    return jsonify(skills_by_category)
