#!/usr/bin/env python3
"""
Test script to verify database connection and table creation
"""

import sys
import os

# Change to backend directory
os.chdir('backend')

from app import create_app, db

app = create_app()

def test_database():
    """Test database connection and table creation"""
    try:
        with app.app_context():
            # Test database connection
            db.session.execute('SELECT 1')
            print("✅ Database connection successful")
            
            # List all tables
            tables = [t.name for t in db.metadata.tables.values()]
            print(f"✅ Database tables: {tables}")
            
            return True
            
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_database()
    sys.exit(0 if success else 1)
