from app import create_app, db
from app.models import PersonalInfo, Experience, Education, Project, Skill
import argparse

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'PersonalInfo': PersonalInfo, 'Experience': Experience, 
            'Education': Education, 'Project': Project, 'Skill': Skill}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Flask application')
    parser.add_argument('--port', type=int, default=5001, help='Port to run the application on')
    args = parser.parse_args()
    
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=args.port)
