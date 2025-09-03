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
    database_url = os.getenv('DATABASE_URL')
    if database_url is None or database_url == '':
        database_url = 'sqlite:///portfolio.db'
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
        CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5174", "http://localhost:5001", "http://localhost:5173", "http://localhost:5175", "https://portfolio-vbrdz.ondigitalocean.app"]}})
        app.logger.info("CORS initialized successfully")
    except Exception as e:
        app.logger.error(f"Error initializing CORS: {e}")
        raise

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
