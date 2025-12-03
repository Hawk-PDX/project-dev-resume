from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
from sqlalchemy import text
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()

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
        
        # Initialize SocketIO with CORS support
        socketio.init_app(app, 
                         cors_allowed_origins="*",
                         async_mode='eventlet',
                         logger=True,
                         engineio_logger=True)
        
        app.logger.info("Database, migrate, and SocketIO initialized successfully")
    except Exception as e:
        app.logger.error(f"Error initializing extensions: {e}")
        # Don't raise - let the app continue without database for now
        app.logger.warning("Continuing without full extension initialization - some features may not work")

    try:
        # CORS Configuration for local development and production
        origins = [
            "http://localhost:5174",
            "http://localhost:5001",
            "http://localhost:5173",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
            "http://127.0.0.1:5001",
            "https://portfolio-frontend-zhcd.onrender.com",
            "https://rosecitydev.tech",
            "https://www.rosecitydev.tech"
        ]
        
        # CORS Configuration for local development and production
        CORS(app,
             resources={r"/api/*": {"origins": origins}},
             methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
             expose_headers=["Content-Type", "Authorization"],
             supports_credentials=False,
             send_wildcard=False,
             vary_header=True
        )
        
        # Add explicit OPTIONS handler for all routes
        @app.before_request
        def handle_preflight():
            if request.method == "OPTIONS":
                response = jsonify({})
                origin = request.headers.get('Origin', '')
                # Check if origin is in allowed list or is localhost
                if origin in origins or origin.startswith('http://localhost:') or origin.startswith('http://127.0.0.1:'):
                    response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Accept,Origin,X-Requested-With'
                response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
                response.headers['Access-Control-Max-Age'] = '3600'
                return response, 200
        
        # Add CORS headers to all responses, including errors
        @app.after_request
        def add_cors_headers(response):
            origin = request.headers.get('Origin', '')
            # Allow any localhost origin for development, or specific origins for production
            if origin in origins or origin.startswith('http://localhost:') or origin.startswith('http://127.0.0.1:'):
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Accept,Origin,X-Requested-With'
                response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
                response.headers['Access-Control-Max-Age'] = '3600'
            return response
        
        app.logger.info(f"CORS initialized with origins: {origins}")
    except Exception as e:
        app.logger.error(f"Error initializing CORS: {e}")
        raise

    # Root API endpoint - provides API info
    @app.route('/api')
    def api_root():
        return jsonify({
            "message": "Portfolio API",
            "version": "2.0",
            "endpoints": {
                "health": "/api/health",
                "warmup": "/api/warmup",
                "resume": "/api/resume",
                "projects": "/api/projects",
                "skills": "/api/skills",
                "analytics": "/api/analytics"
            },
            "websockets": {
                "analytics_namespace": "/analytics"
            }
        })

    # Warmup endpoint to reduce cold starts
    @app.route('/api/warmup')
    def warmup():
        """
        Warmup endpoint that pre-loads common queries to reduce cold start delays.
        Returns a simple success response after warming up the database connection.
        """
        from datetime import datetime
        try:
            # Test database connection and preload common data
            db.session.execute(text('SELECT 1'))

            # Preload common queries to warm up the database
            from app.models import Certificate, Project
            Certificate.query.limit(5).all()
            Project.query.filter_by(featured=True).limit(5).all()

            return jsonify({
                "status": "warmed_up",
                "message": "Server warmed up successfully",
                "timestamp": datetime.utcnow().isoformat()
            })
        except Exception as e:
            app.logger.error(f"Warmup failed: {e}")
            return jsonify({
                "status": "warmup_failed",
                "error": str(e)
            }), 500

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
        from app.routes.analytics import analytics_bp

        app.register_blueprint(resume_bp, url_prefix='/api/resume')
        app.register_blueprint(projects_bp, url_prefix='/api/projects')
        app.register_blueprint(skills_bp, url_prefix='/api/skills')
        app.register_blueprint(analytics_bp)  # Analytics blueprint has its own url_prefix
        app.logger.info("All blueprints registered successfully")
    except Exception as e:
        app.logger.error(f"Error registering blueprints: {e}")
        # Don't raise - create a basic error response blueprint instead
        @app.route('/api/<path:path>')
        def api_error(path):
            return jsonify({"error": "Service temporarily unavailable", "status": "initializing"}), 503
        app.logger.warning("Using fallback error routes due to blueprint registration failure")

    app.logger.info("Flask app created successfully")
    return app
