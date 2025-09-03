from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import text
import os
import re

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Database URL handling
    database_url = os.getenv('DATABASE_URL')
    if database_url is None or database_url == '':
        database_url = 'sqlite:///portfolio.db'
    elif database_url.startswith('postgres://'):  # Handle DigitalOcean's URL format
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Add logging for DATABASE_URL and other env vars
    app.logger.info(f"Using DATABASE_URL: {database_url}")
    app.logger.info(f"FLASK_ENV: {os.getenv('FLASK_ENV')}")
    app.logger.info(f"PORT: {os.getenv('PORT')}")

    try:
        # Initialize extensions
        db.init_app(app)
        migrate.init_app(app, db)
        app.logger.info("Database and migrate initialized successfully")
    except Exception as e:
        app.logger.error(f"Error initializing database: {e}")
        raise

    try:
        # CORS Configuration
        allowed_origins = os.getenv('ALLOWED_ORIGINS', '')
        if allowed_origins:
            origins = allowed_origins.split(',')
        else:
            # Development defaults
            origins = [
                "http://localhost:5174",
                "http://localhost:5001",
                "http://localhost:5173",
                "http://localhost:5175"
            ]
            # Add production URL if available
            prod_url = os.getenv('VITE_API_URL')
            if prod_url:
                # Extract domain from API URL
                match = re.match(r'https?://([^/]+)', prod_url)
                if match:
                    origins.append(f"https://{match.group(1)}")
        
        CORS(app, resources={r"/api/*": {"origins": origins}})
        app.logger.info(f"CORS initialized with origins: {origins}")
    except Exception as e:
        app.logger.error(f"Error initializing CORS: {e}")
        raise

    # Health check endpoint for DigitalOcean
    @app.route('/api/health')
    def health_check():
        try:
            # Test database connection
            db.session.execute(text('SELECT 1'))
            return jsonify({"status": "healthy", "database": "connected"})
        except Exception as e:
            app.logger.error(f"Health check failed: {e}")
            return jsonify({"status": "unhealthy", "error": str(e)}), 500

    try:
        # Register blueprints
        from app.routes.resume import resume_bp
        from app.routes.projects import projects_bp
        from app.routes.skills import skills_bp

        app.register_blueprint(resume_bp, url_prefix='/api/resume')
        app.register_blueprint(projects_bp, url_prefix='/api/projects')
        app.register_blueprint(skills_bp, url_prefix='/api/skills')
        app.logger.info("Blueprints registered successfully")
    except Exception as e:
        app.logger.error(f"Error registering blueprints: {e}")
        raise

    app.logger.info("Flask app created successfully")
    return app
