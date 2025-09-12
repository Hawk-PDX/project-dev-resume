from app import create_app, db
from app.models import PersonalInfo, Experience, Education, Project, Skill
import argparse
import os

app = create_app()

# Initialize database on startup for production
if os.environ.get('FLASK_ENV') == 'production':
    with app.app_context():
        try:
            # Try to create tables if they don't exist
            db.create_all()
            
            # Check if we need to seed the database
            if not Project.query.first():
                print('🌱 Database is empty, seeding with data...')
                from seed_db import seed_database
                seed_database()
                print('✅ Database seeded successfully!')
            else:
                print('📊 Database already contains data')
        except Exception as e:
            print(f'⚠️  Database initialization warning: {e}')

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'PersonalInfo': PersonalInfo, 'Experience': Experience, 
            'Education': Education, 'Project': Project, 'Skill': Skill}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Flask application')
    parser.add_argument('--port', type=int, default=5001, help='Port to run the application on')
    parser.add_argument('--host', type=str, default='127.0.0.1', help='Host to run the application on')
    args = parser.parse_args()
    
    try:
        with app.app_context():
            db.create_all()
            print(f"Starting Flask server on {args.host}:{args.port}")
        app.run(debug=True, host=args.host, port=args.port, threaded=True)
    except Exception as e:
        print(f"Error starting server: {e}")
