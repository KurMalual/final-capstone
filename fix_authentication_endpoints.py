#!/usr/bin/env python3
"""
Script to test and fix authentication endpoints
"""

import os
import sys
import django
import requests

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse

User = get_user_model()

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("🔍 Testing authentication endpoints...")
    
    client = Client()
    
    # Test registration endpoint
    print("\n1. Testing registration endpoint...")
    register_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123',
        'user_type': 'farmer'
    }
    
    try:
        response = client.post('/api/auth/register/', 
                             data=json.dumps(register_data),
                             content_type='application/json')
        print(f"   POST /api/auth/register/ - Status: {response.status_code}")
        if response.status_code != 201:
            print(f"   Response: {response.content.decode()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test login endpoint
    print("\n2. Testing login endpoint...")
    login_data = {
        'username': 'testuser',
        'password': 'testpass123'
    }
    
    try:
        response = client.post('/api/auth/login/',
                             data=json.dumps(login_data),
                             content_type='application/json')
        print(f"   POST /api/auth/login/ - Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Response: {response.content.decode()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test GET requests (should return 405)
    print("\n3. Testing GET requests (should return 405)...")
    try:
        response = client.get('/api/auth/register/')
        print(f"   GET /api/auth/register/ - Status: {response.status_code}")
        
        response = client.get('/api/auth/login/')
        print(f"   GET /api/auth/login/ - Status: {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")

def test_authentication_endpoints():
    print("🚀 Testing and fixing authentication endpoints...")
    print("=" * 50)
    
    # Test user credentials
    test_username = "testuser"
    test_password = "testpass123"
    test_email = "test@example.com"
    
    # Check if test user exists
    print("🔧 Checking user model...")
    try:
        user = User.objects.get(username=test_username)
        print("✅ Test user already exists")
    except User.DoesNotExist:
        print("🔧 Creating test user...")
        user = User.objects.create_user(
            username=test_username,
            email=test_email,
            password=test_password
        )
        print("✅ Test user created")
    
    # Test endpoints
    base_url = "https://smart-farm-advisory-d46b4015b13a.herokuapp.com"
    
    print("\n🔍 Testing authentication endpoints...")
    
    # Test registration endpoint
    print("1. Testing registration endpoint...")
    registration_data = {
        "username": test_username,
        "email": test_email,
        "password": test_password,
        "first_name": "Test",
        "last_name": "User"
    }
    
    print(f"Registration attempt for: {test_username}")
    try:
        response = requests.post(f"{base_url}/api/auth/register/", json=registration_data)
        print(f"   POST /api/auth/register/ - Status: {response.status_code}")
        if response.status_code != 201:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test login endpoint
    print("\n2. Testing login endpoint...")
    login_data = {
        "username": test_username,
        "password": test_password
    }
    
    print(f"Login attempt for username: {test_username}")
    try:
        response = requests.post(f"{base_url}/api/auth/login/", json=login_data)
        print(f"   POST /api/auth/login/ - Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Login successful for user: {test_username}")
            token = response.json().get('token')
            if token:
                print(f"   Token received: {token[:20]}...")
        else:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test GET requests (should return 405)
    print("\n3. Testing GET requests (should return 405)...")
    try:
        response = requests.get(f"{base_url}/api/auth/register/")
        print(f"   GET /api/auth/register/ - Status: {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    try:
        response = requests.get(f"{base_url}/api/auth/login/")
        print(f"   GET /api/auth/login/ - Status: {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n✅ Authentication endpoint test complete!")
    print("If you see 405 errors for GET requests, that's normal.")
    print("The endpoints should only accept POST requests.")

if __name__ == "__main__":
    test_authentication_endpoints()
