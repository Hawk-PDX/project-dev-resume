#!/usr/bin/env python3
"""
Test script to check backend connectivity and diagnose issues
"""
import requests
import time
import os
import sys

# Backend URL
BACKEND_URL = "https://portfolio-backend-skva.onrender.com"

def test_basic_connectivity():
    """Test if the backend is reachable"""
    print("🔍 Testing basic connectivity...")
    try:
        response = requests.get(f"{BACKEND_URL}", timeout=30)
        print(f"   Status Code: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        if response.status_code == 200:
            print("   ✅ Basic connectivity works!")
            return True
        elif response.status_code == 502:
            print("   ❌ 502 Bad Gateway - Service likely not running")
            return False
        else:
            print(f"   ⚠️  Unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Connection failed: {e}")
        return False

def test_health_endpoint():
    """Test the health check endpoint"""
    print("\n🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=30)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data}")
            print("   ✅ Health endpoint works!")
            return True
        else:
            print(f"   ❌ Health check failed with status {response.status_code}")
            if response.text:
                print(f"   Response: {response.text[:200]}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Health check failed: {e}")
        return False

def test_api_root():
    """Test the API root endpoint"""
    print("\n🔍 Testing API root endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/api", timeout=30)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data}")
            print("   ✅ API root endpoint works!")
            return True
        else:
            print(f"   ❌ API root failed with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ API root failed: {e}")
        return False

def wake_up_service():
    """Try to wake up the service by making a simple request"""
    print("\n🌅 Attempting to wake up the service...")
    for attempt in range(3):
        print(f"   Attempt {attempt + 1}/3...")
        try:
            response = requests.get(f"{BACKEND_URL}", timeout=60)
            if response.status_code in [200, 404]:  # 404 is fine, means service is responding
                print("   ✅ Service appears to be awake!")
                return True
            elif response.status_code == 502:
                print("   💤 Service still sleeping, waiting...")
                time.sleep(10)
            else:
                print(f"   ⚠️  Unexpected response: {response.status_code}")
                time.sleep(5)
        except requests.exceptions.RequestException:
            print("   💤 Service not responding, waiting...")
            time.sleep(10)
    
    print("   ❌ Could not wake up the service")
    return False

def main():
    """Run all tests"""
    print("🚀 Backend Connectivity Test")
    print(f"   Testing backend at: {BACKEND_URL}")
    print("=" * 50)
    
    # Test basic connectivity
    if not test_basic_connectivity():
        print("\n💤 Service appears to be sleeping. Attempting to wake it up...")
        if wake_up_service():
            print("\n🔄 Retesting after wake-up...")
            test_basic_connectivity()
        else:
            print("\n❌ Could not establish basic connectivity")
            print("\n🔧 Troubleshooting steps:")
            print("   1. Check your Render dashboard")
            print("   2. Verify the service is deployed and not crashed")
            print("   3. Check the service logs for errors")
            print("   4. Ensure environment variables are set correctly")
            return
    
    # Test specific endpoints
    test_api_root()
    test_health_endpoint()
    
    print("\n" + "=" * 50)
    print("✅ Backend testing complete!")

if __name__ == "__main__":
    main()