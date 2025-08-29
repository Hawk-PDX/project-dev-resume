import json
import pytest
from app.models import Project

def test_get_projects_empty_db(client):
    """Test GET /api/projects/ returns sample data when DB is empty."""
    response = client.get('/api/projects/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2  # Should return 2 sample projects
    assert data[0]['title'] == 'Full Stack Resume Portfolio'
    assert data[1]['title'] == 'E-commerce Platform'

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