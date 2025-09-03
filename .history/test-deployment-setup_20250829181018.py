#!/usr/bin/env python3
"""
Test script to verify deployment setup before pushing to Render.
This helps catch common issues before deployment.
"""

import os
import sys
import subprocess
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and print status."""
    if Path(file_path).exists():
        print(f"✅ {description}: Found")
        return True
    else:
        print(f"❌ {description}: Missing")
        return False

def check_directory_exists(dir_path, description):
    """Check if a directory exists and print status."""
    if Path(dir_path).exists() and Path(dir_path).is_dir():
        print(f"✅ {description}: Found")
        return True
    else:
        print(f"❌ {description}: Missing")
        return False

def run_command(command, description):
    """Run a command and check if it succeeds."""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description}: Success")
            return True
        else:
            print(f"❌ {description}: Failed")
            print(f"   Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description}: Error - {e}")
        return False

def check_pytest_flask_installed():
    """Check if pytest-flask is properly installed and importable."""
    try:
        # Try to import pytest_flask to verify it's installed
        import pytest_flask
        print("✅ pytest-flask: Import successful")
        return True
    except ImportError as e:
        print(f"❌ pytest-flask: Import failed - {e}")
        print("   Try running: pip install pytest-flask==1.3.0")
        return False

def main():
    print("🔍 Testing Deployment Setup")
    print("=" * 50)
    
    # Check essential files
    files_to_check = [
        ("render-fullstack.yaml", "Render deployment configuration"),
        (".env.production", "Production environment file"),
        ("package.json", "Frontend package file"),
        ("backend/requirements.txt", "Backend requirements"),
        ("backend/run.py", "Backend entry point"),
        ("backend/app/__init__.py", "Backend app initialization"),
    ]
    
    all_files_ok = True
    for file_path, description in files_to_check:
        if not check_file_exists(file_path, description):
            all_files_ok = False
    
    # Check essential directories
    directories_to_check = [
        ("src/", "Frontend source code"),
        ("backend/app/", "Backend application"),
        ("backend/app/routes/", "Backend routes"),
    ]
    
    for dir_path, description in directories_to_check:
        if not check_directory_exists(dir_path, description):
            all_files_ok = False
    
    # Test frontend build
    print("\n🏗️  Testing Frontend Build:")
    frontend_ok = run_command("npm install", "npm install")
    if frontend_ok:
        frontend_ok = run_command("npm run build", "Frontend build")
    
    # Test backend dependencies
    print("\n🐍 Testing Backend Setup:")
    backend_ok = run_command("cd backend && pip install -r requirements.txt", "Backend dependencies install")
    
    # Test pytest-flask installation specifically
    print("\n🧪 Testing pytest-flask Installation:")
    pytest_flask_ok = check_pytest_flask_installed()
    
    # Test Python syntax
    python_ok = run_command("python -m py_compile backend/run.py", "Python syntax check")
    
    print("\n" + "=" * 50)
    
    if all_files_ok and frontend_ok and backend_ok and python_ok:
        print("🎉 All tests passed! Your setup looks good for deployment.")
        print("\nNext steps:")
        print("1. Generate SECRET_KEY: python generate-secret.py")
        print("2. Commit changes: git add . && git commit -m 'Add deployment config'")
        print("3. Push to GitHub: git push origin main")
        print("4. Follow deployment guide in DEPLOYMENT_GUIDE.md")
    else:
        print("⚠️  Some tests failed. Please fix the issues above before deploying.")
        sys.exit(1)

if __name__ == "__main__":
    main()
