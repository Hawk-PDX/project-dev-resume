from flask import Blueprint, jsonify, request
from app.models import Project
from app import db
from app.services.github_service import GitHubService
import os

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

        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400

        # Basic validation to prevent spam
        title = data.get('title', '').strip()
        if len(title) < 3:
            return jsonify({'error': 'Title must be at least 3 characters long'}), 400
        if len(title) > 100:
            return jsonify({'error': 'Title must be less than 100 characters'}), 400

        description = data.get('description', '').strip()
        if len(description) > 500:
            return jsonify({'error': 'Description must be less than 500 characters'}), 400

        technologies = data.get('technologies', '').strip()
        if len(technologies) > 200:
            return jsonify({'error': 'Technologies must be less than 200 characters'}), 400

        # Check for excessive URLs (potential spam)
        url_fields = [data.get('github_url', ''), data.get('live_url', ''), data.get('image_url', '')]
        url_count = sum(1 for url in url_fields if url and url.strip())
        if url_count > 2:
            return jsonify({'error': 'Too many URLs provided'}), 400
        
        project_data = {
            'title': data['title'],
            'description': data.get('description', ''),
            'technologies': data.get('technologies', ''),
            'github_url': data.get('github_url', ''),
            'live_url': data.get('live_url', ''),
            'image_url': data.get('image_url', ''),
            'featured': data.get('featured', False),
            'order': data.get('order', 0)
        }
        
        try:
            db.session.execute("SELECT github_account FROM project LIMIT 1")
            project_data['github_account'] = data.get('github_account', '')
        except Exception:
            pass
        
        project = Project(**project_data)
        
        db.session.add(project)
        db.session.commit()
        
        response_data = {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'technologies': project.technologies,
            'github_url': project.github_url,
            'live_url': project.live_url,
            'image_url': project.image_url,
            'featured': project.featured,
            'order': project.order
        }
        
        if hasattr(project, 'github_account'):
            response_data['github_account'] = getattr(project, 'github_account', None)
        
        return jsonify(response_data), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def get_projects():
    try:
        projects = Project.query.order_by(Project.order.desc()).all()
        
        return jsonify([{
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'technologies': project.technologies,
            'github_url': project.github_url,
            'github_account': getattr(project, 'github_account', None),
            'live_url': project.live_url,
            'image_url': project.image_url,
            'featured': project.featured,
            'order': project.order,
            'created_at': project.created_at.isoformat() if project.created_at else None
        } for project in projects])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/fetch-github', methods=['POST'])
def fetch_github_project():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must contain JSON data'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        github_url = data.get('github_url')
        
        if not github_url or not github_url.strip():
            return jsonify({'error': 'GitHub URL is required'}), 400
        
        if 'github.com' not in github_url.lower():
            return jsonify({'error': 'Please provide a valid GitHub URL'}), 400
        
        github_token = os.getenv('GITHUB_TOKEN')
        github_service = GitHubService(github_token)
        
        project_info = github_service.fetch_repository_info(github_url.strip())
        
        return jsonify(project_info), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to fetch GitHub data: {str(e)}'}), 500

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
        'github_account': getattr(project, 'github_account', None),
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
        
        # Update only the fields that are provided in the request
        if 'title' in data:
            project.title = data['title']
        if 'description' in data:
            project.description = data.get('description', '')
        if 'technologies' in data:
            project.technologies = data.get('technologies', '')
        if 'github_url' in data:
            project.github_url = data.get('github_url', '')
        if 'github_account' in data and hasattr(project, 'github_account'):
            project.github_account = data.get('github_account', '')
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
            'github_account': getattr(project, 'github_account', None),
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

@projects_bp.route('/fetch-github-repos', methods=['POST'])
def fetch_github_repositories():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must contain JSON data'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        github_accounts = data.get('github_accounts', [])
        if not github_accounts or not isinstance(github_accounts, list):
            return jsonify({'error': 'github_accounts array is required'}), 400
        
        # Initialize GitHub service with optional token from environment
        github_token = os.getenv('GITHUB_TOKEN')
        github_service = GitHubService(github_token)
        
        all_repos = []
        
        for account in github_accounts:
            if not isinstance(account, str) or not account.strip():
                continue
                
            try:
                # Fetch repositories for this account
                repos = github_service.fetch_user_repositories(account.strip())
                all_repos.extend(repos)
            except Exception as e:
                # Log the error but continue with other accounts
                print(f"Error fetching repos for {account}: {str(e)}")
                continue
        
        return jsonify({
            'repositories': all_repos,
            'total_count': len(all_repos)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch GitHub repositories: {str(e)}'}), 500

@projects_bp.route('/featured', methods=['GET'])
def get_featured_projects():
    try:
        projects = Project.query.filter_by(featured=True).order_by(Project.order.desc()).all()
    except Exception as e:
        # If query fails, return empty list with error
        return jsonify({'error': str(e), 'projects': []}), 500

    return jsonify([{
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'technologies': project.technologies,
        'github_url': project.github_url,
        'github_account': getattr(project, 'github_account', None),
        'live_url': project.live_url,
        'image_url': project.image_url,
        'featured': project.featured,
        'order': project.order
    } for project in projects])

@projects_bp.route('/github-accounts', methods=['GET'])
def get_github_accounts():
    try:
        # Get distinct GitHub accounts from projects
        accounts_query = db.session.query(Project.github_account).distinct().filter(
            Project.github_account.isnot(None),
            Project.github_account != ''
        ).all()
        
        accounts = [account[0] for account in accounts_query if account[0]]
        
        # If no accounts in projects, return default accounts
        if not accounts:
            default_accounts = ['Hawk-PDX']  # Add your GitHub usernames here
            return jsonify({
                'github_accounts': default_accounts,
                'source': 'default',
                'message': 'No GitHub accounts found in projects. Using default accounts.'
            })
        
        return jsonify({
            'github_accounts': sorted(accounts),
            'source': 'projects',
            'total_count': len(accounts)
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch GitHub accounts',
            'debug_info': str(e) if os.getenv('FLASK_ENV') != 'production' else None
        }), 500

@projects_bp.route('/populate-sample', methods=['POST'])
def populate_sample_projects():
    try:
        # Check if projects already exist
        existing_count = Project.query.count()
        if existing_count > 0:
            return jsonify({
                'message': f'Database already has {existing_count} projects. Sample data not added.',
                'status': 'skipped'
            })
        
        sample_projects = [
            {
                'title': 'NEO Tracker',
                'description': 'A Next.js application for tracking Near Earth Objects using NASA\'s API with real-time data visualization.',
                'technologies': 'Next.js, TypeScript, Tailwind CSS, NASA API, Render.com',
                'github_url': 'https://github.com/Hawk-PDX/neo-tracker',
                'github_account': 'Hawk-PDX',
                'live_url': 'https://neo-tracker.onrender.com',
                'featured': True,
                'order': 1
            },
            {
                'title': 'Portfolio Resume Application',
                'description': 'Full-stack portfolio website built with React frontend and Flask backend, featuring project management and skill tracking.',
                'technologies': 'React, Flask, Python, PostgreSQL, Docker, Render.com',
                'github_url': 'https://github.com/Hawk-PDX/project-dev-resume',
                'github_account': 'Hawk-PDX',
                'live_url': 'https://portfolio-frontend-zhcd.onrender.com',
                'featured': True,
                'order': 2
            }
        ]
        
        created_projects = []
        for project_data in sample_projects:
            project = Project(**project_data)
            db.session.add(project)
            created_projects.append(project_data['title'])
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': f'Created {len(created_projects)} sample projects',
            'projects': created_projects
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to create sample projects',
            'debug_info': str(e) if os.getenv('FLASK_ENV') != 'production' else None
        }), 500
