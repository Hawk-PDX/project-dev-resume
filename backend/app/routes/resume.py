from flask import Blueprint, jsonify, request
from app.models import PersonalInfo, Experience, Education, Certificate
from app import db
from datetime import datetime

# Blueprint for resume-related endpoints
resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/personal', methods=['GET', 'PUT'])
def get_personal_info():
    """
    Get personal information including name, contact details, and professional summary.
    Returns default data if no database entries exist.
    PUT: Update personal information.
    """
    if request.method == 'PUT':
        data = request.get_json()
        try:
            personal_info = PersonalInfo.query.first()
            if not personal_info:
                return jsonify({'error': 'No personal info found to update'}), 404
            
            # Update fields if provided
            if 'name' in data:
                personal_info.name = data['name']
            if 'title' in data:
                personal_info.title = data['title']
            if 'email' in data:
                personal_info.email = data['email']
            if 'phone' in data:
                personal_info.phone = data['phone']
            if 'location' in data:
                personal_info.location = data['location']
            if 'linkedin' in data:
                personal_info.linkedin = data['linkedin']
            if 'github' in data:
                personal_info.github = data['github']
            if 'website' in data:
                personal_info.website = data['website']
            if 'summary' in data:
                personal_info.summary = data['summary']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Personal info updated successfully',
                'github': personal_info.github
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to update personal info', 'details': str(e)}), 500
    
    try:
        personal_info = PersonalInfo.query.first()
        if not personal_info:
            # Return default data when database is empty
            return jsonify({
                'name': 'Garrett Hawkins',
                'title': 'Full Stack Developer',
                'email': 'hawkpdx@icloud.com',
                'phone': None,
                'location': 'Portland, Oregon',
                'linkedin': 'https://linkedin.com/in/hawkpdx',
                'github': 'https://github.com/Hawk-PDX',
                'website': 'https://rosecitydev.tech',
                'summary': 'Full-stack developer who enjoys building web apps with React and Python. I like figuring out complex problems and turning them into simple, working solutions.'
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
    except Exception as e:
        # Log the error and return a 500 response with details
        print(f"Error in get_personal_info: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to retrieve personal information',
            'details': str(e)
        }), 500

@resume_bp.route('/experience', methods=['GET'])
def get_experience():
    """
    Get work experience history, ordered by most recent first.
    Returns sample data if no experience entries exist in database.
    """
    try:
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
                'description': 'Built and maintained full-stack web applications using React and Flask. Worked on migrating older systems to cloud infrastructure.',
                'technologies': 'React, Python, Flask, PostgreSQL, Docker',
                'achievements': '• Improved application performance by 40%\n• Worked with a team of 3 developers\n• Set up CI/CD pipeline that cut deployment time by 60%'
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
    except Exception as e:
        # Log the error and return a 500 response with details
        print(f"Error in get_experience: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to retrieve experience data',
            'details': str(e)
        }), 500

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
            if data.get('issue_date') and data['issue_date'].strip():
                issue_date = datetime.strptime(data['issue_date'], '%Y-%m-%d').date()
            if data.get('expiry_date') and data['expiry_date'].strip():
                expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()

            new_certificate = Certificate(
                entity=data['entity'],
                course=data['course'],
                topics=data.get('topics', ''),
                description=data.get('description', ''),
                credit_hrs=data.get('credit_hrs'),
                issue_date=issue_date,
                expiry_date=expiry_date,
                credential_id=data.get('credential_id', ''),
                credential_url=data.get('credential_url', ''),
                photo_url=data.get('photo_url', ''),
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
                'credential_url': new_certificate.credential_url,
                'photo_url': new_certificate.photo_url
            }), 201

        except Exception as e:
            db.session.rollback()
            print(f"Error creating certificate: {str(e)}")
            print(f"Data received: {data}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': 'Failed to create certificate', 'details': str(e)}), 500

    # GET request with timeout protection
    try:
        import signal
        def timeout_handler(signum, frame):
            raise TimeoutError("Database query timed out")
        
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(5)  # 5 second timeout
        
        try:
            certificates = Certificate.query.order_by(Certificate.order.desc()).all()
        finally:
            signal.alarm(0)
    
    except (Exception, TimeoutError) as e:
        print(f"Error fetching certificates: {str(e)}")
        # Return sample data on database error
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
            'credential_url': 'https://coursera.org/verify/ABC123456',
            'photo_url': None
        }])

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
            'credential_url': 'https://coursera.org/verify/ABC123456',
            'photo_url': None
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
        'credential_url': cert.credential_url,
        'photo_url': cert.photo_url
    } for cert in certificates])

@resume_bp.route('/certificates/<int:certificate_id>', methods=['GET', 'PUT', 'DELETE'])
def certificate_by_id(certificate_id):
    """
    Handle individual certificate operations:
    GET: Retrieve a specific certificate
    PUT: Update an existing certificate
    DELETE: Delete a certificate
    """
    certificate = Certificate.query.get(certificate_id)
    if not certificate:
        return jsonify({'error': 'Certificate not found'}), 404
    
    if request.method == 'GET':
        return jsonify({
            'id': certificate.id,
            'entity': certificate.entity,
            'course': certificate.course,
            'topics': certificate.topics,
            'description': certificate.description,
            'credit_hrs': certificate.credit_hrs,
            'issue_date': certificate.issue_date.isoformat() if certificate.issue_date else None,
            'expiry_date': certificate.expiry_date.isoformat() if certificate.expiry_date else None,
            'credential_id': certificate.credential_id,
            'credential_url': certificate.credential_url,
            'photo_url': certificate.photo_url,
            'order': certificate.order
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['entity', 'course']
        for field in required_fields:
            if field in data and not data[field]:
                return jsonify({'error': f'{field} cannot be empty'}), 400
        
        try:
            # Update certificate fields
            if 'entity' in data:
                certificate.entity = data['entity']
            if 'course' in data:
                certificate.course = data['course']
            if 'topics' in data:
                certificate.topics = data.get('topics', '')
            if 'description' in data:
                certificate.description = data.get('description', '')
            if 'credit_hrs' in data:
                certificate.credit_hrs = data.get('credit_hrs')
            if 'credential_id' in data:
                certificate.credential_id = data.get('credential_id', '')
            if 'credential_url' in data:
                certificate.credential_url = data.get('credential_url', '')
            if 'photo_url' in data:
                certificate.photo_url = data.get('photo_url', '')
            if 'order' in data:
                certificate.order = data.get('order', 0)
            
            # Handle date fields
            if 'issue_date' in data:
                if data['issue_date'] and data['issue_date'].strip():
                    certificate.issue_date = datetime.strptime(data['issue_date'], '%Y-%m-%d').date()
                else:
                    certificate.issue_date = None
            if 'expiry_date' in data:
                if data['expiry_date'] and data['expiry_date'].strip():
                    certificate.expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
                else:
                    certificate.expiry_date = None
            
            db.session.commit()
            
            return jsonify({
                'id': certificate.id,
                'entity': certificate.entity,
                'course': certificate.course,
                'topics': certificate.topics,
                'description': certificate.description,
                'credit_hrs': certificate.credit_hrs,
                'issue_date': certificate.issue_date.isoformat() if certificate.issue_date else None,
                'expiry_date': certificate.expiry_date.isoformat() if certificate.expiry_date else None,
                'credential_id': certificate.credential_id,
                'credential_url': certificate.credential_url,
                'photo_url': certificate.photo_url,
                'order': certificate.order
            })
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to update certificate', 'details': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(certificate)
            db.session.commit()
            return jsonify({'message': 'Certificate deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to delete certificate', 'details': str(e)}), 500
