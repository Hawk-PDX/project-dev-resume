#!/usr/bin/env python3
"""
Test script to verify all required Python packages are installed and importable.
This uses the correct import names for all packages.
"""

import sys

def test_import(module_name, import_name=None):
    """Test if a module can be imported successfully."""
    if import_name is None:
        import_name = module_name
    
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', 'unknown version')
        print(f"✅ {module_name}: {version}")
        return True
    except ImportError as e:
        print(f"❌ {module_name}: Import failed - {e}")
        return False
    except Exception as e:
        print(f"⚠️  {module_name}: Import succeeded but error getting version - {e}")
        return True

def main():
    print("🔍 Testing Python Package Imports")
    print("=" * 50)
    
    # List of packages to test with their correct import names
    packages = [
        ("flask", "flask"),
        ("flask_cors", "flask_cors"), 
        ("flask_migrate", "flask_migrate"),
        ("flask_sqlalchemy", "flask_sqlalchemy"),
        ("gunicorn", "gunicorn"),
        ("pytest", "pytest"),
