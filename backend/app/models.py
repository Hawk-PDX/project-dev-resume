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

# Analytics Models for Real-Time Tracking
class AnalyticsSession(db.Model):
    """Track unique visitor sessions"""
    __tablename__ = 'analytics_sessions'
    
    id = db.Column(db.String(36), primary_key=True)  # UUID
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    user_agent = db.Column(db.Text)
    referrer = db.Column(db.String(500))
    country = db.Column(db.String(2))  # ISO country code
    city = db.Column(db.String(100))
    device_type = db.Column(db.String(20))  # mobile, tablet, desktop
    browser = db.Column(db.String(50))
    os = db.Column(db.String(50))
    screen_resolution = db.Column(db.String(20))  # e.g., "1920x1080"
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    total_time_seconds = db.Column(db.Integer, default=0)
    page_views = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    events = db.relationship('AnalyticsEvent', backref='session', lazy='dynamic', cascade='all, delete-orphan')

class AnalyticsEvent(db.Model):
    """Track specific user interactions"""
    __tablename__ = 'analytics_events'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(36), db.ForeignKey('analytics_sessions.id'), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)  # page_view, skill_hover, project_click, etc.
    event_category = db.Column(db.String(50), nullable=False)  # navigation, interaction, engagement
    event_label = db.Column(db.String(200))  # specific identifier (e.g., skill name, project title)
    page_path = db.Column(db.String(200))
    element_id = db.Column(db.String(100))  # DOM element ID if applicable
    event_metadata = db.Column(db.JSON)  # Flexible JSON field for additional data
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Performance metrics
    page_load_time = db.Column(db.Integer)  # milliseconds
    time_on_page = db.Column(db.Integer)  # seconds

class AnalyticsMetrics(db.Model):
    """Daily aggregated metrics for efficient reporting"""
    __tablename__ = 'analytics_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True)
    
    # Traffic metrics
    unique_visitors = db.Column(db.Integer, default=0)
    total_sessions = db.Column(db.Integer, default=0)
    total_page_views = db.Column(db.Integer, default=0)
    avg_session_duration = db.Column(db.Float, default=0.0)  # seconds
    bounce_rate = db.Column(db.Float, default=0.0)  # percentage
    
    # Engagement metrics
    project_clicks = db.Column(db.Integer, default=0)
    skill_interactions = db.Column(db.Integer, default=0)
    github_clicks = db.Column(db.Integer, default=0)
    contact_interactions = db.Column(db.Integer, default=0)
    
    # Popular content (JSON arrays)
    top_projects = db.Column(db.JSON)  # [{"title": "Project", "clicks": 10}, ...]
    top_skills_viewed = db.Column(db.JSON)  # [{"name": "React", "views": 25}, ...]
    top_pages = db.Column(db.JSON)  # [{"path": "/projects", "views": 50}, ...]
    
    # Device/browser breakdown
    device_breakdown = db.Column(db.JSON)  # {"mobile": 60, "desktop": 40}
    browser_breakdown = db.Column(db.JSON)  # {"Chrome": 70, "Firefox": 20, "Safari": 10}
    
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class SystemHealth(db.Model):
    """Track system performance and health metrics"""
    __tablename__ = 'system_health'
    
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Performance metrics
    cpu_usage = db.Column(db.Float)  # percentage
    memory_usage = db.Column(db.Float)  # percentage
    disk_usage = db.Column(db.Float)  # percentage
    
    # Application metrics
    active_connections = db.Column(db.Integer, default=0)
    avg_response_time = db.Column(db.Float)  # milliseconds
    error_count = db.Column(db.Integer, default=0)
    
    # Database metrics
    db_connections = db.Column(db.Integer, default=0)
    db_query_time = db.Column(db.Float)  # average milliseconds
    
    # Status indicators
    status = db.Column(db.String(20), default='healthy')  # healthy, warning, critical
    alerts_triggered = db.Column(db.JSON)  # Array of alert messages
