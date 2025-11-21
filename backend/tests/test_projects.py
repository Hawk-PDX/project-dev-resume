import json
import pytest
from app.models import Project
from app import db

def test_get_projects_empty_db(client):
    """Test GET /api/projects/ returns empty list when DB is empty."""
    response = client.get('/api/projects/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) == 0  # Should return empty list when no projects exist

def test_create_project(client):
    """Test POST /api/projects/ creates a new project."""
    project_data = {
        'title': 'Test Project',
        'description': 'A test project',
        'technologies': 'Python, Flask',
        'github_url': 'https://github.com/test',
        'featured': True,
        'order': 1
    }
    response = client.post('/api/projects/', json=project_data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['title'] == 'Test Project'
    assert data['featured'] == True

def test_create_project_missing_title(client):
    """Test POST /projects/ with missing required title field."""
    project_data = {
        'description': 'A test project'
    }
    response = client.post('/api/projects/', json=project_data)
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert data['error'] == 'Title is required'

def test_get_single_project(client):
    """Test GET /projects/<id> returns correct project."""
    # First create a project
    project_data = {'title': 'Test Project'}
    response = client.post('/api/projects/', json=project_data)
    project_id = json.loads(response.data)['id']
    
    # Then get it
    response = client.get(f'/api/projects/{project_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == 'Test Project'

def test_get_nonexistent_project(client):
    """Test GET /projects/<id> with non-existent ID."""
    response = client.get('/api/projects/999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data
    assert data['error'] == 'Project not found'

def test_update_project(client):
    """Test PUT /projects/<id> updates project."""
    # First create a project
    project_data = {'title': 'Original Title'}
    response = client.post('/api/projects/', json=project_data)
    project_id = json.loads(response.data)['id']
    
    # Then update it
    update_data = {
        'title': 'Updated Title',
        'featured': True
    }
    response = client.put(f'/api/projects/{project_id}', json=update_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == 'Updated Title'
    assert data['featured'] == True

def test_delete_project(client):
    """Test DELETE /projects/<id> removes project."""
    # First create a project
    project_data = {'title': 'To Be Deleted'}
    response = client.post('/api/projects/', json=project_data)
    project_id = json.loads(response.data)['id']
    
    # Then delete it
    response = client.delete(f'/api/projects/{project_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Project deleted successfully'
    
    # Verify it's gone
    response = client.get(f'/api/projects/{project_id}')
    assert response.status_code == 404

def test_get_featured_projects(client):
    """Test GET /projects/featured returns only featured projects."""
    # Create featured and non-featured projects
    client.post('/api/projects/', json={'title': 'Featured 1', 'featured': True})
    client.post('/api/projects/', json={'title': 'Non-featured', 'featured': False})
    client.post('/api/projects/', json={'title': 'Featured 2', 'featured': True})
    
    response = client.get('/api/projects/featured')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert all(p['featured'] for p in data)

def test_update_nonexistent_project(client):
    """Test PUT /projects/<id> with non-existent ID."""
    response = client.put('/api/projects/999', json={'title': 'New Title'})
    assert response.status_code == 404
    data = json.loads(response.data)
    assert data['error'] == 'Project not found'

def test_delete_nonexistent_project(client):
    """Test DELETE /projects/<id> with non-existent ID."""
    response = client.delete('/api/projects/999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert data['error'] == 'Project not found'

# CORS Tests
def test_cors_headers_on_successful_response(client):
    """Test CORS headers are correctly applied to successful responses."""
    # Create a project
    project_data = {'title': 'Test Project'}
    response = client.post('/api/projects/', json=project_data)
    
    # Check CORS headers on successful response
    assert response.status_code == 201
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'GET' in response.headers.get('Access-Control-Allow-Methods', '')
    assert 'POST' in response.headers.get('Access-Control-Allow-Methods', '')
    assert 'Access-Control-Allow-Headers' in response.headers
    assert 'Content-Type' in response.headers.get('Access-Control-Allow-Headers', '')

def test_cors_headers_on_error_response(client):
    """Test CORS headers are correctly applied to error responses."""
    # Make a request that will fail (missing required title)
    project_data = {'description': 'No title provided'}
    response = client.post('/api/projects/', json=project_data)
    
    # Check CORS headers on error response
    assert response.status_code == 400
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers
    data = json.loads(response.data)
    assert 'error' in data

def test_cors_headers_on_get_request(client):
    """Test CORS headers are correctly applied to GET requests."""
    response = client.get('/api/projects/')
    
    assert response.status_code == 200
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers

def test_cors_headers_on_not_found_error(client):
    """Test CORS headers are correctly applied to 404 error responses."""
    response = client.get('/api/projects/999')
    
    assert response.status_code == 404
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers

# Database retrieval tests
def test_get_projects_retrieves_from_database(client, app):
    """Test get_projects endpoint retrieves project data from the database."""
    from app.models import Project
    
    # Create projects directly in the database
    with app.app_context():
        project1 = Project(
            title='Database Project 1',
            description='First project',
            technologies='Python',
            order=2
        )
        project2 = Project(
            title='Database Project 2',
            description='Second project',
            technologies='Flask',
            order=1
        )
        db.session.add(project1)
        db.session.add(project2)
        db.session.commit()
    
    # Retrieve projects via API
    response = client.get('/api/projects/')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert len(data) == 2
    # Check that projects are ordered by order field descending
    assert data[0]['title'] == 'Database Project 1'
    assert data[1]['title'] == 'Database Project 2'
    assert data[0]['order'] == 2
    assert data[1]['order'] == 1

def test_get_projects_returns_all_fields(client, app):
    """Test get_projects returns all expected fields for each project."""
    from app.models import Project
    
    with app.app_context():
        project = Project(
            title='Complete Project',
            description='A complete project',
            technologies='Python, Flask',
            github_url='https://github.com/test/repo',
            live_url='https://example.com',
            image_url='https://example.com/image.png',
            featured=True,
            order=5
        )
        db.session.add(project)
        db.session.commit()
    
    response = client.get('/api/projects/')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert len(data) == 1
    project_data = data[0]
    
    # Verify all expected fields are present
    assert 'id' in project_data
    assert project_data['title'] == 'Complete Project'
    assert project_data['description'] == 'A complete project'
    assert project_data['technologies'] == 'Python, Flask'
    assert project_data['github_url'] == 'https://github.com/test/repo'
    assert project_data['live_url'] == 'https://example.com'
    assert project_data['image_url'] == 'https://example.com/image.png'
    assert project_data['featured'] == True
    assert project_data['order'] == 5
    assert 'demo' in project_data
    assert 'created_at' in project_data

# Exception handling tests
def test_get_projects_handles_database_exception(client, app, monkeypatch):
    """Test get_projects endpoint handles exceptions gracefully and returns an error message."""
    from app.models import Project
    
    # Mock the query to raise an exception
    def mock_query_error(*args, **kwargs):
        raise Exception("Database connection error")
    
    # Patch the Project.query to raise an exception
    monkeypatch.setattr(Project, 'query', property(lambda self: mock_query_error()))
    
    response = client.get('/api/projects/')
    
    # Should return 500 error with error message
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data
    assert isinstance(data['error'], str)

def test_create_project_handles_database_exception(client, monkeypatch):
    """Test add_project handles database exceptions and rolls back."""
    from app import db as database
    
    # Mock db.session.commit to raise an exception
    original_commit = database.session.commit
    def mock_commit_error():
        raise Exception("Database commit failed")
    
    monkeypatch.setattr(database.session, 'commit', mock_commit_error)
    
    project_data = {'title': 'Test Project'}
    response = client.post('/api/projects/', json=project_data)
    
    # Should return 500 error
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data

# Featured projects filtering tests
def test_get_featured_projects_filters_by_featured_status(client, app):
    """Test get_featured_projects endpoint filters projects by featured status."""
    from app.models import Project
    
    with app.app_context():
        # Create mix of featured and non-featured projects
        featured1 = Project(title='Featured 1', featured=True, order=3)
        featured2 = Project(title='Featured 2', featured=True, order=2)
        non_featured = Project(title='Not Featured', featured=False, order=1)
        
        db.session.add_all([featured1, featured2, non_featured])
        db.session.commit()
    
    response = client.get('/api/projects/featured')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert len(data) == 2
    assert all(project['featured'] for project in data)
    assert data[0]['title'] == 'Featured 1'
    assert data[1]['title'] == 'Featured 2'

def test_get_featured_projects_filters_demo_in_production(client, app, monkeypatch):
    """Test get_featured_projects filters by demo status in production environment."""
    from app.models import Project
    
    # Set environment to production
    monkeypatch.setenv('FLASK_ENV', 'production')
    
    with app.app_context():
        # Create featured projects with different demo status
        real_project = Project(
            title='Real Featured Project',
            featured=True,
            demo=False,
            order=2
        )
        demo_project = Project(
            title='Demo Featured Project',
            featured=True,
            demo=True,
            order=1
        )
        
        db.session.add_all([real_project, demo_project])
        db.session.commit()
    
    response = client.get('/api/projects/featured')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    # In production, only non-demo featured projects should be returned
    assert len(data) == 1
    assert data[0]['title'] == 'Real Featured Project'
    assert data[0]['demo'] == False

def test_get_featured_projects_includes_demo_in_development(client, app, monkeypatch):
    """Test get_featured_projects includes demo projects in non-production environments."""
    from app.models import Project
    
    # Set environment to development (or unset production)
    monkeypatch.setenv('FLASK_ENV', 'development')
    
    with app.app_context():
        # Create featured projects with different demo status
        real_project = Project(
            title='Real Featured Project',
            featured=True,
            demo=False,
            order=2
        )
        demo_project = Project(
            title='Demo Featured Project',
            featured=True,
            demo=True,
            order=1
        )
        
        db.session.add_all([real_project, demo_project])
        db.session.commit()
    
    response = client.get('/api/projects/featured')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    # In development, all featured projects should be returned
    assert len(data) == 2

def test_get_featured_projects_handles_exceptions(client, app, monkeypatch):
    """Test get_featured_projects handles database exceptions gracefully."""
    from app.models import Project
    
    # Mock the query to raise an exception
    original_query = Project.query
    
    class MockQuery:
        def filter_by(self, **kwargs):
            raise Exception("Database query failed")
    
    monkeypatch.setattr(Project, 'query', MockQuery())
    
    response = client.get('/api/projects/featured')
    
    # Should return 500 error with error message and empty projects list
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data
    assert data['projects'] == []
