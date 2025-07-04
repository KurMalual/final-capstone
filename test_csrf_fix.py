import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from django.conf import settings

def test_csrf_settings():
    """Test CSRF configuration"""
    print("🔧 Testing CSRF Configuration...")
    print(f"CSRF_TRUSTED_ORIGINS: {getattr(settings, 'CSRF_TRUSTED_ORIGINS', 'Not set')}")
    print(f"CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'Not set')}")
    print(f"CORS_ALLOW_ALL_ORIGINS: {getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', 'Not set')}")
    
    # Check if localhost:3000 is in trusted origins
    trusted_origins = getattr(settings, 'CSRF_TRUSTED_ORIGINS', [])
    if 'http://localhost:3000' in trusted_origins:
        print("✅ localhost:3000 is in CSRF_TRUSTED_ORIGINS")
    else:
        print("❌ localhost:3000 is NOT in CSRF_TRUSTED_ORIGINS")
    
    return True

def test_equipment_api():
    """Test equipment API endpoint"""
    print("\n🧪 Testing Equipment API...")
    
    try:
        # Test GET request first
        response = requests.get('http://localhost:8000/api/equipment/')
        print(f"GET /api/equipment/ - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Equipment API is accessible")
            data = response.json()
            print(f"Found {len(data)} equipment items")
        else:
            print(f"❌ Equipment API returned {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False
    
    return True

def test_authentication():
    """Test authentication endpoint"""
    print("\n🔐 Testing Authentication...")
    
    try:
        # Test login endpoint
        login_data = {
            'username': 'Equipm2',
            'password': 'equipm123'
        }
        
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"POST /api/auth/login/ - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Authentication is working")
            data = response.json()
            if 'token' in data:
                print("✅ Token received")
                return data['token']
            else:
                print("⚠️ No token in response")
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing authentication: {e}")
    
    return None

def main():
    print("🚀 Testing CSRF Fix and Equipment API\n")
    
    # Test 1: CSRF Settings
    test_csrf_settings()
    
    # Test 2: Equipment API
    api_working = test_equipment_api()
    
    # Test 3: Authentication
    token = test_authentication()
    
    print("\n📋 Summary:")
    print("1. Check that Django server is running: python manage.py runserver")
    print("2. Check that CSRF_TRUSTED_ORIGINS includes localhost:3000")
    print("3. Try adding equipment through the web interface")
    
    if api_working and token:
        print("\n✅ Backend appears to be working correctly!")
        print("The CSRF error should be resolved now.")
    else:
        print("\n⚠️ There may still be issues. Check the Django server logs.")

if __name__ == "__main__":
    main()
