#!/usr/bin/env python3
"""
Test script to verify backend connectivity and troubleshoot HTTP 403 errors.
"""

import requests
import sys

def test_backend_connectivity():
    """Test connectivity to the backend API endpoints"""
    
    base_urls = [
        "http://localhost:5000",
        "http://localhost:5001"
    ]
    
    endpoints = [
        "/api/health",
        "/api/skills/",
        "/api/projects/",
        "/api/resume/personal"
    ]
    
    print("Testing backend connectivity...\n")
    
    for base_url in base_urls:
        print(f"Testing base URL: {base_url}")
        print("-" * 50)
        
        for endpoint in endpoints:
            url = base_url + endpoint
            try:
                response = requests.get(url, timeout=5)
                print(f"GET {endpoint}: {response.status_code} - {response.reason}")
                
                if response.status_code == 200:
                    print(f"  Success! Response: {response.json()}")
                elif response.status_code == 403:
                    print(f"  ❌ 403 Forbidden - Check CORS configuration")
                    print(f"  Headers: {dict(response.headers)}")
                else:
                    print(f"  Response: {response.text[:100]}...")
                    
            except requests.exceptions.ConnectionError:
                print(f"GET {endpoint}: ❌ Connection refused (server not running)")
            except requests.exceptions.Timeout:
                print(f"GET {endpoint}: ⏰ Timeout (server may be slow to respond)")
            except Exception as e:
                print(f"GET {endpoint}: ❌ Error - {e}")
            
            print()
        
        print()

if __name__ == "__main__":
    test_backend_connectivity()
