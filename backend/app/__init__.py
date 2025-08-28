from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///portfolio.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5174", "http://localhost:5001", "http://localhost:5173", "http://localhost:5175"]}})
    
    # Register blueprints
    from app.routes.resume import resume_bp
    from app.routes.projects import projects_bp
    from app.routes.skills import skills_bp
    from app.routes.contact import contact_bp
    
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(contact_bp, url_prefix='/api')
    
    return app
