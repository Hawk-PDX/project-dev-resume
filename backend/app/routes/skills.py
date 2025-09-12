from flask import Blueprint, jsonify, request
from app.models import Skill
from app import db
from app.services.skill_calculator import SkillCalculator
from datetime import datetime

# Blueprint for skills-related endpoints
skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/', methods=['GET'])
def get_skills():
    """
    Get all skills categorized by type (frontend, backend, database, tools).
    Returns sample data if no skills exist in the database.
    """
    skills = Skill.query.order_by(Skill.category, Skill.order.desc()).all()
    
    if not skills:
        # Return sample skill data when database is empty
        return jsonify({
            'frontend': [
                {'name': 'React', 'level': 5, 'category': 'frontend'},
                {'name': 'JavaScript', 'level': 5, 'category': 'frontend'},
                {'name': 'TypeScript', 'level': 4, 'category': 'frontend'},
                {'name': 'HTML5', 'level': 5, 'category': 'frontend'},
                {'name': 'Vue.js', 'level': 3, 'category': 'frontend'},
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
    
    # Group skills by their category for organized frontend display
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

@skills_bp.route('/calculate', methods=['POST'])
def calculate_skills():
    """
    Auto-calculate skills from project data.
    Supports preserving manual overrides.
    """
    try:
        data = request.get_json() or {}
        preserve_overrides = data.get('preserve_manual_overrides', True)
        
        result = SkillCalculator.sync_skills_with_projects(preserve_overrides)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@skills_bp.route('/insights', methods=['GET'])
def get_skill_insights():
    """
    Get insights about skills and project alignment.
    """
    try:
        insights = SkillCalculator.get_skill_insights()
        return jsonify(insights)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/<int:skill_id>', methods=['GET', 'PUT', 'DELETE'])
def skill_detail(skill_id):
    """
    Handle individual skill operations: GET, PUT (update), DELETE
    """
    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404
    
    if request.method == 'GET':
        return jsonify({
            'id': skill.id,
            'name': skill.name,
            'category': skill.category,
            'level': skill.level,
            'order': skill.order,
            'manual_override': skill.manual_override,
            'auto_calculated_level': skill.auto_calculated_level,
            'project_count': skill.project_count,
            'last_calculated': skill.last_calculated.isoformat() if skill.last_calculated else None
        })
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            # Update skill fields
            if 'name' in data:
                skill.name = data['name']
            if 'category' in data:
                skill.category = data['category']
            if 'level' in data:
                skill.level = data['level']
                skill.manual_override = True  # Mark as manually overridden
            if 'order' in data:
                skill.order = data['order']
            
            db.session.commit()
            
            return jsonify({
                'id': skill.id,
                'name': skill.name,
                'category': skill.category,
                'level': skill.level,
                'order': skill.order,
                'manual_override': skill.manual_override
            })
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(skill)
            db.session.commit()
            return jsonify({'message': 'Skill deleted successfully'})
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@skills_bp.route('/add', methods=['POST'])
def add_skill():
    """
    Add a new skill manually.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('category'):
            return jsonify({'error': 'Name and category are required'}), 400
        
        new_skill = Skill(
            name=data['name'],
            category=data['category'],
            level=data.get('level', 3),
            order=data.get('order', 0),
            manual_override=True  # Manually added skills are always marked as overrides
        )
        
        db.session.add(new_skill)
        db.session.commit()
        
        return jsonify({
            'id': new_skill.id,
            'name': new_skill.name,
            'category': new_skill.category,
            'level': new_skill.level,
            'order': new_skill.order,
            'manual_override': new_skill.manual_override
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
