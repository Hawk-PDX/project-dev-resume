from flask import Blueprint, jsonify, request
from app.models import Project
from app import db

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/', methods=['GET', 'POST'])
def projects():
    if request.method == 'POST':
        return add_project()
    return get_projects()

@projects_bp.route('/<int:project_id>', methods=['GET', 'PUT', 'DELETE'])
def project(project_id):
    if request.method == 'GET':
        return get_project(project_id)
    elif request.method == 'PUT':
        return update_project(project_id)
    elif request.method == 'DELETE':
        return delete_project(project_id)

def add_project():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        # Create new project
        project = Project(
            title=data['title'],
            description=data.get('description', ''),
            technologies=data.get('technologies', ''),
            github_url=data.get('github_url', ''),
            live_url=data.get('live_url', ''),
            image_url=data.get('image_url', ''),
            featured=data.get('featured', False),
            order=data.get('order', 0)
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'technologies': project.technologies,
            'github_url': project.github_url,
            'live_url': project.live_url,
            'image_url': project.image_url,
            'featured': project.featured,
            'order': project.order
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def get_projects():
    projects = Project.query.order_by(Project.order.desc(), Project.created_at.desc()).all()
    
    if not projects:
        # Return sample data
        return jsonify([{
            'id': 1,
            'title': 'Full Stack Resume Portfolio',
            'description': 'A modern, responsive portfolio website built with React and Flask to showcase my skills and projects.',
            'technologies': 'React, Flask, Python, PostgreSQL, Docker, AWS',
            'github_url': 'https://github.com/yourusername/portfolio',
            'live_url': 'https://yourportfolio.com',
            'image_url': '/api/static/images/portfolio.jpg',
            'featured': True,
            'order': 1
        }, {
            'id': 2,
            'title': 'E-commerce Platform',
            'description': 'Complete e-commerce solution with user authentication, payment processing, and admin dashboard.',
            'technologies': 'React, Flask, Stripe, PostgreSQL, Redis',
            'github_url': 'https://github.com/yourusername/ecommerce',
            'live_url': 'https://your-ecommerce-demo.com',
            'image_url': '/api/static/images/ecommerce.jpg',
            'featured': True,
            'order': 2
        }])
    
    return jsonify([{
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'technologies': project.technologies,
        'github_url': project.github_url,
        'live_url': project.live_url,
        'image_url': project.image_url,
        'featured': project.featured,
        'order': project.order
    } for project in projects])

def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    return jsonify({
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'technologies': project.technologies,
        'github_url': project.github_url,
        'live_url': project.live_url,
        'image_url': project.image_url,
        'featured': project.featured,
        'order': project.order,
        'created_at': project.created_at.isoformat() if project.created_at else None
    })

def update_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        data = request.get_json()
        
        # Update project fields
        if 'title' in data:
            project.title = data['title']
        if 'description' in data:
            project.description = data.get('description', '')
        if 'technologies' in data:
            project.technologies = data.get('technologies', '')
        if 'github_url' in data:
            project.github_url = data.get('github_url', '')
        if 'live_url' in data:
            project.live_url = data.get('live_url', '')
        if 'image_url' in data:
            project.image_url = data.get('image_url', '')
        if 'featured' in data:
            project.featured = data.get('featured', False)
        if 'order' in data:
            project.order = data.get('order', 0)
        
        db.session.commit()
        
        return jsonify({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'technologies': project.technologies,
            'github_url': project.github_url,
            'live_url': project.live_url,
            'image_url': project.image_url,
            'featured': project.featured,
            'order': project.order
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def delete_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({'message': 'Project deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/featured', methods=['GET'])
def get_featured_projects():
    projects = Project.query.filter_by(featured=True).order_by(Project.order.desc()).all()
    
    return jsonify([{
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'technologies': project.technologies,
        'github_url': project.github_url,
        'live_url': project.live_url,
        'image_url': project.image_url,
        'featured': project.featured,
        'order': project.order
    } for project in projects])
