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

@pytest.mark.skip(reason="Contact form functionality has been removed to simplify the project")
def test_contact_endpoint_missing_data(client):
    """Test contact endpoint with missing data."""
    pytest.skip("Contact form functionality has been removed")

@pytest.mark.skip(reason="Contact form functionality has been removed to simplify the project")
def test_contact_endpoint_success(client):
    """Test successful contact form submission."""
    pytest.skip("Contact form functionality has been removed")

@pytest.mark.skip(reason="Contact form functionality has been removed to simplify the project")
def test_contact_endpoint_invalid_email(client):
    """Test contact endpoint with invalid email."""
    pytest.skip("Contact form functionality has been removed")

@pytest.mark.skip(reason="Contact form functionality has been removed to simplify the project")
def test_contact_endpoint_no_config(client, monkeypatch):
    """Test contact endpoint when email configuration is missing."""
    pytest.skip("Contact form functionality has been removed")
