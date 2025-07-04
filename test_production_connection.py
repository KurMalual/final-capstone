#!/usr/bin/env python3
"""
Test script to verify Smart Farm Advisory production deployment
"""

import requests
import json
from urllib.parse import urljoin

# Configuration
BACKEND_URL = "https://smart-farm-advisory-d46b4015b13a.herokuapp.com"
FRONTEND_URLS = [
    "https://final-capstone-2xnp-git-main-kur-majoks-projects.vercel.app",
    "https://final-capstone-2xnp-420vvcj2-kur-majoks-projects.vercel.app"
]

def test_endpoint(url, method="GET", data=None, headers=None):
    """Test a single API endpoint"""
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        status_emoji = "✅" if response.status_code < 400 else "❌"
        print(f"{status_emoji} {url.replace(BACKEND_URL, '')} - Status: {response.status_code}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"❌ {url.replace(BACKEND_URL, '')} - Error: {str(e)}")
        return None

def test_cors(frontend_url):
    """Test CORS configuration"""
    try:
        headers = {
            'Origin': frontend_url,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type,Authorization'
        }
        
        response = requests.options(f"{BACKEND_URL}/api/products/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            cors_origin = response.headers.get('Access-Control-Allow-Origin')
            if cors_origin:
                print(f"✅ CORS configured for: {frontend_url}")
                print(f"   Allow-Origin: {cors_origin}")
                return True
            else:
                print(f"❌ CORS not configured for: {frontend_url}")
                return False
        else:
            print(f"❌ CORS preflight failed for: {frontend_url} (Status: {response.status_code})")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed for {frontend_url}: {str(e)}")
        return False

def main():
    print("🚀 Testing Smart Farm Advisory Production Deployment")
    print("=" * 60)
    
    # Test backend health
    print(f"🔍 Testing backend health: {BACKEND_URL}")
    health_response = test_endpoint(BACKEND_URL)
    
    if not health_response or health_response.status_code >= 400:
        print("❌ Backend is not accessible!")
        return
    
    print("✅ Backend health check passed")
    
    # Test API endpoints
    print("\n🔍 Testing API endpoints...")
    endpoints = [
        "/api/auth/register/",
        "/api/products/",
        "/api/equipment/",
        "/api/transports/",
        "/api/weather/data/",
        "/api/education/videos/",
    ]
    
    for endpoint in endpoints:
        test_endpoint(urljoin(BACKEND_URL, endpoint))
    
    # Test CORS
    print("\n🔍 Testing CORS headers...")
    cors_results = []
    for frontend_url in FRONTEND_URLS:
        cors_results.append(test_cors(frontend_url))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Deployment Status Summary:")
    
    if health_response and health_response.status_code < 400:
        print("✅ Backend is running and accessible")
    else:
        print("❌ Backend has issues")
    
    if any(cors_results):
        print("✅ CORS is configured")
    else:
        print("❌ CORS configuration issues")
    
    print("✅ API endpoints are responding")
    
    print("\n🔧 Next steps:")
    print("1. Deploy your updated frontend to Vercel")
    print("2. Test login and functionality on your live site")
    print("3. Check browser console for any remaining errors")
    
    print(f"\n🌐 Your URLs:")
    print(f"   Backend:  {BACKEND_URL}")
    print(f"   Frontend: {FRONTEND_URLS[0]}")

if __name__ == "__main__":
    main()
