from app import create_app, db, socketio
from app.models import PersonalInfo, Experience, Education, Project, Skill
import argparse
import os
import sys

app = create_app()

if os.environ.get('FLASK_ENV') == 'production':
    with app.app_context():
        db.create_all()

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
            print(f"Starting Flask-SocketIO server on {args.host}:{args.port}")
        socketio.run(app, debug=True, host=args.host, port=args.port, allow_unsafe_werkzeug=True)
    except Exception as e:
        print(f"Error starting server: {e}")
