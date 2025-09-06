from app import create_app, db
from app.models import PersonalInfo

def add_personal_info():
    app = create_app()
    with app.app_context():
        # Check if personal info already exists
        existing = PersonalInfo.query.first()
        if existing:
            print("Personal info already exists in the database.")
            return

        # Add your personal info here
        personal_info = PersonalInfo(
            name="Your Name",
            title="Your Title",
            email="your.email@example.com",
            phone="+1 (555) 123-4567",
            location="Your City, Your State",
            linkedin="https://linkedin.com/in/yourprofile",
            github="https://github.com/yourgithub",
            website="https://yourwebsite.com",
            summary="A brief professional summary about yourself."
        )
        db.session.add(personal_info)
        db.session.commit()
        print("Personal info added successfully.")

if __name__ == "__main__":
    add_personal_info()
