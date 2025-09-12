#!/usr/bin/env bash
# start.sh - Render start script for backend

set -o errexit  # exit on error

echo "🚀 Starting Flask backend on Render..."

# Initialize database if it doesn't exist
echo "🗄️  Checking database..."
flask db upgrade || echo "Database migration completed"

# Check if database is empty and seed if needed
python -c "
from app import create_app, db
from app.models import Project
app = create_app()
with app.app_context():
    if not Project.query.first():
        print('📊 Database is empty, seeding with data...')
        import subprocess
        subprocess.run(['python', 'seed_db.py'])
    else:
        print('📊 Database already has data, skipping seed')
"

echo "✅ Database ready!"
echo "🌐 Starting Gunicorn server..."

# Start the application
exec gunicorn --bind 0.0.0.0:$PORT run:app