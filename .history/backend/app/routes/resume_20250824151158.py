from flask import Blueprint, jsonify
from app.models import PersonalInfo, Experience, Education
from app import db

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/personal', methods=['GET'])
def get_personal_info():
    personal_info = PersonalInfo.query.first()
    if not personal_info:
        # Return default data
        return jsonify({
            'name': 'Your Name',
            'title': 'Full Stack Developer',
            'email': 'your.email@example.com',
            'phone': '+1 (555) 123-4567',
            'location': 'Your City, State',
            'linkedin': 'https://linkedin.com/in/yourprofile',
            'github': 'https://github.com/yourusername',
            'website': 'https://yourwebsite.com',
            'summary': 'Passionate full-stack developer with expertise in React, Python, and Flask. Experienced in building scalable web applications and passionate about clean code and user experience.'
        })
    
    return jsonify({
        'id': personal_info.id,
        'name': personal_info.name,
        'title': personal_info.title,
        'email': personal_info.email,
        'phone': personal_info.phone,
        'location': personal_info.location,
        'linkedin': personal_info.linkedin,
        'github': personal_info.github,
        'website': personal_info.website,
        'summary': personal_info.summary
    })

@resume_bp.route('/experience', methods=['GET'])
def get_experience():
    experiences = Experience.query.order_by(Experience.order.desc()).all()
    
    if not experiences:
        # Return sample data
        return jsonify([{
            'id': 1,
            'company': 'Tech Solutions Inc.',
            'position': 'Full Stack Developer',
            'start_date': '2023-01-01',
            'end_date': None,
            'current': True,
            'description': 'Developed and maintained full-stack web applications using React and Flask. Led the migration of legacy systems to modern cloud infrastructure.',
            'technologies': 'React, Python, Flask, PostgreSQL, Docker',
            'achievements': '• Increased application performance by 40%\n• Led team of 3 developers\n• Implemented CI/CD pipeline reducing deployment time by 60%'
        }])
    
    return jsonify([{
        'id': exp.id,
        'company': exp.company,
        'position': exp.position,
        'start_date': exp.start_date.isoformat() if exp.start_date else None,
        'end_date': exp.end_date.isoformat() if exp.end_date else None,
        'current': exp.current,
        'description': exp.description,
        'technologies': exp.technologies,
        'achievements': exp.achievements
    } for exp in experiences])

@resume_bp.route('/education', methods=['GET'])
def get_education():
    education = Education.query.order_by(Education.order.desc()).all()
    
    if not education:
        # Return sample data
        return jsonify([{
            'id': 1,
            'institution': 'University of Technology',
            'degree': 'Bachelor of Science',
            'field': 'Computer Science',
            'start_date': '2019-09-01',
            'end_date': '2023-05-01',
            'gpa': 3.8,
            'description': 'Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems'
        }])
    
    return jsonify([{
        'id': edu.id,
        'institution': edu.institution,
        'degree': edu.degree,
        'field': edu.field,
        'start_date': edu.start_date.isoformat() if edu.start_date else None,
        'end_date': edu.end_date.isoformat() if edu.end_date else None,
        'gpa': edu.gpa,
        'description': edu.description
    } for edu in education])
