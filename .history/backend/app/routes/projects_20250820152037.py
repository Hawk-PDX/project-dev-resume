from flask import Blueprint, jsonify
from app.models import Project
from app import db

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/', methods=['GET'])
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
