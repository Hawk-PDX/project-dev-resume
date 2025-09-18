from app import create_app, db
from app.models import PersonalInfo, Experience, Education, Project, Skill
import argparse
import os
import sys

app = create_app()

# Initialize database on startup for production
if os.environ.get('FLASK_ENV') == 'production':
    with app.app_context():
        try:
            print('🚀 Starting production database initialization...')
            
            # Run database migration first
            print('🔄 Running database migration...')
            try:
                from migrate_db import migrate_database
                if migrate_database():
                    print('✅ Database migration completed')
                else:
                    print('⚠️ Database migration failed, continuing anyway')
            except Exception as migrate_error:
                print(f'⚠️ Migration error (continuing): {migrate_error}')
            
            # Try to create tables if they don't exist
            db.create_all()
            print('✅ Database tables created successfully')
            
            # Warm up the database connection and verify tables
            from sqlalchemy import text, inspect
            db.session.execute(text('SELECT 1'))
            print('🔥 Database connection warmed up')
            
            # Verify tables exist
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            expected_tables = ['personal_info', 'experience', 'education', 'project', 'skill', 'certificate']
            missing_tables = [table for table in expected_tables if table not in tables]
            
            if missing_tables:
                print(f'⚠️ Missing tables: {missing_tables}. Attempting to recreate...')
                # Force create all tables again
                db.create_all()
                # Verify again
                tables = inspector.get_table_names()
                still_missing = [table for table in expected_tables if table not in tables]
                if still_missing:
                    print(f'❌ Still missing tables after recreation: {still_missing}')
                else:
                    print('✅ All tables created successfully on retry')
            else:
                print(f'✅ All expected tables exist: {tables}')
            
            # Check if we need to seed the database
            project_count = Project.query.count()
            if project_count == 0:
                print('🌱 Database is empty, seeding with data...')
                try:
                    from seed_db import seed_database
                    seed_database()
                    print('✅ Database seeded successfully!')
                except Exception as seed_error:
                    print(f'⚠️ Database seeding failed, but continuing: {seed_error}')
                    # Create minimal data if seeding fails
                    try:
                        personal_info = PersonalInfo(
                            name='Garrett Hawkins',
                            title='Full Stack Developer',
                            email='hawkpdx@icloud.com',
                            location='Portland, Oregon',
                            linkedin='https://linkedin.com/in/hawkpdx',
                            github='https://github.com/HawkPDX',
                            website='https://github.com/HawkPDX',
                            summary='Passionate full-stack developer with expertise in React, Python, and Flask.'
                        )
                        db.session.add(personal_info)
                        db.session.commit()
                        print('✅ Minimal data created successfully')
                    except Exception as minimal_error:
                        print(f'⚠️ Even minimal data creation failed: {minimal_error}')
            else:
                print(f'📊 Database already contains {project_count} projects')
                
        except Exception as e:
            print(f'❌ Database initialization failed: {e}')
            print('🔄 Attempting to continue without database initialization...')
            # Don't exit - let the app try to start anyway

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
