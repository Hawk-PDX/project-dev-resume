from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import text
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Database URL handling
    database_url = os.getenv('DATABASE_URL', 'sqlite:///portfolio.db')
    
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
        # CORS Configuration for local development and production
        origins = [
            "http://localhost:5174",
            "http://localhost:5001",
            "http://localhost:5173",
            "http://localhost:5175",
            "https://portfolio-frontend-zhcd.onrender.com"
        ]
        
        # Additional CORS setup for production
        if os.getenv('FLASK_ENV') == 'production':
            # More permissive CORS for production deployment
            CORS(app, 
                 origins=["https://portfolio-frontend-zhcd.onrender.com"],
                 methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
                 supports_credentials=True,
                 expose_headers=["Content-Type", "Authorization"]
            )
        else:
            # Development CORS
            CORS(app, 
                 resources={r"/api/*": {
                     "origins": origins,
                     "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                     "allow_headers": ["Content-Type", "Authorization"],
                     "supports_credentials": True
                 }})
        app.logger.info(f"CORS initialized with origins: {origins}")
    except Exception as e:
        app.logger.error(f"Error initializing CORS: {e}")
        raise

    # Root API endpoint - provides API info
    @app.route('/api')
    def api_root():
        return jsonify({
            "message": "Portfolio API",
            "version": "1.0",
            "endpoints": {
                "health": "/api/health",
                "resume": "/api/resume",
                "projects": "/api/projects",
                "skills": "/api/skills"
            }
        })

    # Health check endpoint
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
