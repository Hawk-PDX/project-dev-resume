import pytest
import os
from app import create_app, db
from app.models import PersonalInfo

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Use test configuration
    os.environ['TESTING'] = 'True'
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    os.environ['EMAIL_SERVICE'] = 'console'  # Use console email for testing
    
    app = create_app()
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()

def test_contact_endpoint_missing_data(client):
    """Test contact endpoint with missing data."""
    # Test missing name
    response = client.post('/api/contact', json={
        'email': 'test@example.com',
        'message': 'Test message'
    })
    assert response.status_code == 400
    assert 'error' in response.get_json()
    assert 'name' in response.get_json()['error'].lower()

    # Test missing email
    response = client.post('/api/contact', json={
        'name': 'Test User',
        'message': 'Test message'
    })
    assert response.status_code == 400
    assert 'error' in response.get_json()
    assert 'email' in response.get_json()['error'].lower()

    # Test missing message
    response = client.post('/api/contact', json={
        'name': 'Test User',
        'email': 'test@example.com'
    })
    assert response.status_code == 400
    assert 'error' in response.get_json()
    assert 'message' in response.get_json()['error'].lower()

def test_contact_endpoint_success(client):
    """Test successful contact form submission."""
    response = client.post('/api/contact', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'This is a test message for the contact form.'
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] == True
    assert 'message' in data

def test_contact_endpoint_invalid_email(client):
    """Test contact endpoint with invalid email."""
    response = client.post('/api/contact', json={
        'name': 'Test User',
        'email': 'invalid-email',
        'message': 'Test message'
    })
    
    # The endpoint should still accept the request since email validation
    # is handled by the frontend. The backend just sends whatever email is provided.
    assert response.status_code == 200

def test_contact_endpoint_no_config(client, monkeypatch):
    """Test contact endpoint when email configuration is missing."""
    # Remove TO_EMAIL configuration
    monkeypatch.delenv('TO_EMAIL', raising=False)
    
    response = client.post('/api/contact', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'Test message'
    })
    
    assert response.status_code == 500
    data = response.get_json()
    assert data['success'] == False
    assert 'error' in data
