#!/usr/bin/env python3
"""
Quick test script to verify pytest-flask installation and functionality.
This helps diagnose the ModuleNotFoundError for pytest_flask.
"""

import sys
import subprocess

def test_pytest_flask_installation():
    """Test if pytest-flask is properly installed and importable."""
    print("🧪 Testing pytest-flask installation...")
    
    # Test 1: Try to import pytest_flask directly
    try:
        import pytest_flask
        print("✅ pytest_flask imported successfully")
        print(f"   Version: {pytest_flask.__version__ if hasattr(pytest_flask, '__version__') else 'unknown'}")
    except ImportError as e:
        print(f"❌ Failed to import pytest_flask: {e}")
        return False
    
    # Test 2: Check if pytest can find the plugin
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", "--version"
        ], capture_output=True, text=True, timeout=10)
        
        if "pytest-flask" in result.stdout or "pytest-flask" in result.stderr:
            print("✅ pytest-flask plugin detected by pytest")
        else:
            print("⚠️  pytest-flask plugin not detected by pytest (but import works)")
            print(f"   pytest output: {result.stdout}")
            
    except (subprocess.TimeoutExpired, subprocess.SubprocessError) as e:
        print(f"⚠️  Could not run pytest: {e}")
    
    return True

def test_backend_requirements():
    """Test if backend requirements are properly installed."""
    print("\n📦 Testing backend requirements installation...")
    
    try:
        # Try to import key Flask packages
        import flask
        import flask_sqlalchemy
        import flask_migrate
        import flask_cors
        import pytest
        
        print("✅ All key Flask packages imported successfully")
        print(f"   Flask: {flask.__version__}")
        print(f"   Flask-SQLAlchemy: {flask_sqlalchemy.__version__ if hasattr(flask_sqlalchemy, '__version__') else 'unknown'}")
        print(f"   Flask-Migrate: {flask_migrate.__version__ if hasattr(flask_migrate, '__version__') else 'unknown'}")
        print(f"   Flask-CORS: {flask_cors.__version__ if hasattr(flask_cors, '__version__') else 'unknown'}")
        print(f"   pytest: {pytest.__version__}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import required package: {e}")
        return False

def main():
    """Run all tests."""
    print("🔍 pytest-flask Installation Diagnostic Tool")
    print("=" * 50)
    
    success = True
    
    # Test pytest-flask installation
    if not test_pytest_flask_installation():
        success = False
    
    # Test backend requirements
    if not test_backend_requirements():
        success = False
    
    print("\n" + "=" * 50)
    
    if success:
        print("🎉 All tests passed! pytest-flask should work correctly.")
        print("\nTo run your tests:")
        print("  cd backend && python -m pytest tests/ -v")
    else:
        print("⚠️  Some tests failed. Try installing dependencies:")
        print("  cd backend && pip install -r requirements.txt")
        print("  or")
        print("  pip install pytest-flask==1.3.0")
        sys.exit(1)

if __name__ == "__main__":
    main()
