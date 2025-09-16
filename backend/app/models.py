from app import db
from datetime import datetime

class PersonalInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    linkedin = db.Column(db.String(200))
    github = db.Column(db.String(200))
    website = db.Column(db.String(200))
    summary = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    current = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)
    technologies = db.Column(db.String(500))
    achievements = db.Column(db.Text)
    order = db.Column(db.Integer, default=0)

class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    institution = db.Column(db.String(100), nullable=False)
    degree = db.Column(db.String(100), nullable=False)
    field = db.Column(db.String(100))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    gpa = db.Column(db.Float)
    description = db.Column(db.Text)
    order = db.Column(db.Integer, default=0)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    technologies = db.Column(db.String(500))
    github_url = db.Column(db.String(200))
    github_account = db.Column(db.String(100))  # GitHub username/organization name
    live_url = db.Column(db.String(200))
    image_url = db.Column(db.String(200))
    featured = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    level = db.Column(db.Integer, default=3)  # 1-5 scale
    order = db.Column(db.Integer, default=0)
    manual_override = db.Column(db.Boolean, default=False)  # True if manually set
    auto_calculated_level = db.Column(db.Integer)  # Store calculated level for reference
    project_count = db.Column(db.Integer, default=0)  # Number of projects using this skill
    last_calculated = db.Column(db.DateTime)  # When it was last auto-calculated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entity = db.Column(db.String(100), nullable=False)
    course = db.Column(db.String(100), nullable=False)
    topics = db.Column(db.String(500))
    description = db.Column(db.Text)
    credit_hrs = db.Column(db.Integer)
    issue_date = db.Column(db.Date)
    expiry_date = db.Column(db.Date)
    credential_id = db.Column(db.String(100))
    credential_url = db.Column(db.String(200))
    order = db.Column(db.Integer, default=0)
