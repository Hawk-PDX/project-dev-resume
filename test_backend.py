#!/usr/bin/env python3
"""
Quick test script to verify backend API endpoints
"""
import requests
import json
import time

BASE_URL = "https://portfolio-backend-skva.onrender.com"

def test_endpoint(endpoint, expected_status=200, timeout=10):
    """Test an API endpoint and return results"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\nTesting: {url}")
    
    try:
        start_time = time.time()
        response = requests.get(url, timeout=timeout, headers={
            'Origin': 'https://rosecitydev.tech'
        })
        end_time = time.time()
        
        print(f"Status: {response.status_code}")
        print(f"Response time: {(end_time - start_time):.2f}s")
        print(f"CORS headers: {response.headers.get('Access-Control-Allow-Origin', 'MISSING')}")
        
        if response.status_code == expected_status:
            try:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)[:200]}{'...' if len(str(data)) > 200 else ''}")
                return True, data
            except:
                print("Non-JSON response")
                return True, response.text
        else:
            print(f"Unexpected status code. Expected {expected_status}, got {response.status_code}")
            try:
                print(f"Error response: {response.json()}")
            except:
                print(f"Error response: {response.text}")
            return False, None
            
    except requests.Timeout:
        print(f"❌ TIMEOUT after {timeout}s")
        return False, None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False, None

def main():
    print("🧪 Testing Backend API Endpoints")
    print("=" * 40)
    
    endpoints = [
        "/api/health",
        "/api/warmup", 
        "/api/projects/",
        "/api/resume/certificates",
        "/api"
    ]
    
    results = {}
    for endpoint in endpoints:
        success, data = test_endpoint(endpoint)
        results[endpoint] = success
    
    print("\n" + "=" * 40)
    print("📊 SUMMARY:")
    for endpoint, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {endpoint}")
    
    overall_success = all(results.values())
    if overall_success:
        print("\n🎉 All endpoints working!")
    else:
        print(f"\n⚠️  {sum(not s for s in results.values())} endpoints failing")

if __name__ == "__main__":
    main()