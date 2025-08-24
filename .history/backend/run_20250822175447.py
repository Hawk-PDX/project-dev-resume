from app import create_app, db
from app.models import PersonalInfo, Experience, Education, Project, Skill

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'PersonalInfo': PersonalInfo, 'Experience': Experience, 
            'Education': Education, 'Project': Project, 'Skill': Skill}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
