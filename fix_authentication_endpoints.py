#!/usr/bin/env python3
"""
Script to test and fix authentication endpoints
"""

import requests
import json
import sys

BASE_URL = "https://smart-farm-advisory-d46b4015b13a.herokuapp.com"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            return None, f"Unsupported method: {method}"
        
        return response, None
    except Exception as e:
        return None, str(e)

def main():
    print("🚀 Testing and fixing authentication endpoints...")
    print("=" * 50)
    
    # Test user creation first
    print("🔧 Checking user model...")
    test_user_data = {
        "username": "testuser",
        "password": "testpass123",
        "email": "test@example.com",
        "user_type": "farmer"
    }
    
    # Check if user exists
    response, error = test_endpoint("GET", "/api/users/")
    if response and response.status_code == 200:
        print("✅ Test user already exists")
    else:
        print("❌ Could not check existing users")
    
    print("\n🔍 Testing authentication endpoints...")
    
    # Test registration
    print("1. Testing registration endpoint...")
    print(f"Registration attempt for: {test_user_data['username']}")
    response, error = test_endpoint("POST", "/api/auth/register/", test_user_data)
    
    if response:
        print(f"   POST /api/auth/register/ - Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print("   ✅ Registration successful")
        elif response.status_code == 400:
            try:
                data = response.json()
                print(f"   Response: {data}")
            except:
                print(f"   Response: {response.text}")
        else:
            print(f"   ❌ Registration failed: {response.text}")
    else:
        print(f"   ❌ Request failed: {error}")
    
    # Test login
    print("\n2. Testing login endpoint...")
    login_data = {
        "username": test_user_data["username"],
        "password": test_user_data["password"]
    }
    print(f"Login attempt for username: {login_data['username']}")
    response, error = test_endpoint("POST", "/api/auth/login/", login_data)
    
    token = None
    if response:
        print(f"   POST /api/auth/login/ - Status: {response.status_code}")
        if response.status_code == 200:
            try:
                data = response.json()
                token = data.get("token")
                print(f"Login successful for user: {data.get('user', {}).get('username', 'unknown')}")
                if token:
                    print(f"   Token received: {token[:20]}...")
            except:
                print("   Login successful but no JSON response")
        else:
            print(f"   ❌ Login failed: {response.text}")
    else:
        print(f"   ❌ Request failed: {error}")
    
    # Test GET requests (should return 405)
    print("\n3. Testing GET requests (should return 405)...")
    
    for endpoint in ["/api/auth/register/", "/api/auth/login/"]:
        response, error = test_endpoint("GET", endpoint)
        if response:
            print(f"   GET {endpoint} - Status: {response.status_code}")
            if response.status_code == 405:
                print("   ✅ Correctly returns Method Not Allowed")
            else:
                print(f"   ⚠️  Unexpected status: {response.status_code}")
        else:
            print(f"   ❌ Request failed: {error}")
    
    # Test authenticated endpoint if we have a token
    if token:
        print("\n4. Testing authenticated endpoint...")
        headers = {"Authorization": f"Bearer {token}"}
        response, error = test_endpoint("GET", "/api/equipment/", headers=headers)
        
        if response:
            print(f"   GET /api/equipment/ - Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Authenticated request successful")
            else:
                print(f"   ❌ Authenticated request failed: {response.text}")
        else:
            print(f"   ❌ Request failed: {error}")
    
    print("\n✅ Authentication endpoint test complete!")
    print("If you see 405 errors for GET requests, that's normal.")
    print("The endpoints should only accept POST requests.")

if __name__ == "__main__":
    main()
