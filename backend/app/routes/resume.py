from flask import Blueprint, jsonify, request
from app.models import PersonalInfo, Experience, Education, Certificate
from app import db
from datetime import datetime

# Blueprint for resume-related endpoints
resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/personal', methods=['GET'])
def get_personal_info():
    """
    Get personal information including name, contact details, and professional summary.
    Returns default data if no database entries exist.
    """
    personal_info = PersonalInfo.query.first()
    if not personal_info:
        # Return default data when database is empty
        return jsonify({
            'name': 'Garrett Hawkins',
            'title': 'Full Stack Developer',
            'email': 'hawkpdx@icloud.com',
            'phone': '+1 (971) 438-6340',
            'location': 'Portland, Oregon',
            'linkedin': 'https://linkedin.com/in/hawkpdx',
            'github': 'https://github.com/HawkPDX',
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
    """
    Get work experience history, ordered by most recent first.
    Returns sample data if no experience entries exist in database.
    """
    experiences = Experience.query.order_by(Experience.order.desc()).all()
    
    if not experiences:
        # Return sample experience data when database is empty
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
    """
    Get education history, ordered by most recent first.
    Returns sample data if no education entries exist in database.
    """
    education = Education.query.order_by(Education.order.desc()).all()
    
    if not education:
        # Return sample education data when database is empty
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

@resume_bp.route('/certificates', methods=['GET', 'POST'])
def get_certificates():
    """
    Get certificates, ordered by most recent first.
    Returns sample data if no certificate entries exist in database.
    POST: Create a new certificate.
    """
    if request.method == 'POST':
        data = request.get_json()

        # Validate required fields
        required_fields = ['entity', 'course']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400

        try:
            # Convert date strings to date objects
            issue_date = None
            expiry_date = None
            if data.get('issue_date'):
                issue_date = datetime.strptime(data['issue_date'], '%Y-%m-%d').date()
            if data.get('expiry_date'):
                expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()

            new_certificate = Certificate(
                entity=data['entity'],
                course=data['course'],
                topics=data.get('topics'),
                description=data.get('description'),
                credit_hrs=data.get('credit_hrs'),
                issue_date=issue_date,
                expiry_date=expiry_date,
                credential_id=data.get('credential_id'),
                credential_url=data.get('credential_url'),
                order=data.get('order', 0)
            )

            db.session.add(new_certificate)
            db.session.commit()

            return jsonify({
                'id': new_certificate.id,
                'entity': new_certificate.entity,
                'course': new_certificate.course,
                'topics': new_certificate.topics,
                'description': new_certificate.description,
                'credit_hrs': new_certificate.credit_hrs,
                'issue_date': new_certificate.issue_date.isoformat() if new_certificate.issue_date else None,
                'expiry_date': new_certificate.expiry_date.isoformat() if new_certificate.expiry_date else None,
                'credential_id': new_certificate.credential_id,
                'credential_url': new_certificate.credential_url
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to create certificate', 'details': str(e)}), 500

    # GET request
    certificates = Certificate.query.order_by(Certificate.order.desc()).all()

    if not certificates:
        # Return sample certificate data when database is empty
        return jsonify([{
            'id': 1,
            'entity': 'Coursera',
            'course': 'Google Data Analytics Professional Certificate',
            'topics': 'Data Analysis, SQL, Tableau, R Programming',
            'description': 'Comprehensive program covering data analytics fundamentals and tools',
            'credit_hrs': 160,
            'issue_date': '2023-06-01',
            'expiry_date': None,
            'credential_id': 'ABC123456',
            'credential_url': 'https://coursera.org/verify/ABC123456'
        }])

    return jsonify([{
        'id': cert.id,
        'entity': cert.entity,
        'course': cert.course,
        'topics': cert.topics,
        'description': cert.description,
        'credit_hrs': cert.credit_hrs,
        'issue_date': cert.issue_date.isoformat() if cert.issue_date else None,
        'expiry_date': cert.expiry_date.isoformat() if cert.expiry_date else None,
        'credential_id': cert.credential_id,
        'credential_url': cert.credential_url
    } for cert in certificates])
