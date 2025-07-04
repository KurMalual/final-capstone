#!/usr/bin/env python3
"""
Comprehensive test to verify CSRF and form submission fixes
"""

import os
import sys
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from products.models import Product
from equipment.models import Equipment

User = get_user_model()

def test_csrf_configuration():
    """Test CSRF configuration"""
    print("🔧 Testing CSRF Configuration...")
    
    csrf_trusted = getattr(settings, 'CSRF_TRUSTED_ORIGINS', [])
    cors_allowed = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
    
    print(f"CSRF_TRUSTED_ORIGINS: {csrf_trusted}")
    print(f"CORS_ALLOWED_ORIGINS: {cors_allowed}")
    print(f"CSRF_COOKIE_HTTPONLY: {getattr(settings, 'CSRF_COOKIE_HTTPONLY', True)}")
    print(f"CSRF_COOKIE_SECURE: {getattr(settings, 'CSRF_COOKIE_SECURE', True)}")
    
    if 'http://localhost:3000' in csrf_trusted:
        print("✅ localhost:3000 is in CSRF_TRUSTED_ORIGINS")
        return True
    else:
        print("❌ localhost:3000 is NOT in CSRF_TRUSTED_ORIGINS")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("\n🧪 Testing API Endpoints...")
    
    base_url = "http://localhost:8000"
    session = requests.Session()
    
    try:
        # Test CSRF endpoint
        csrf_response = session.get(f"{base_url}/api/users/csrf/")
        if csrf_response.status_code == 200:
            print("✅ CSRF endpoint working")
            csrf_token = csrf_response.json().get('csrfToken')
            if csrf_token:
                print(f"✅ CSRF token received: {csrf_token[:20]}...")
            else:
                print("❌ No CSRF token in response")
                return False
        else:
            print(f"❌ CSRF endpoint failed: {csrf_response.status_code}")
            return False
        
        # Test login endpoint
        login_data = {
            'username': 'Farmer',
            'password': 'farmer123'
        }
        
        headers = {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'
        }
        
        login_response = session.post(
            f"{base_url}/api/users/login/",
            json=login_data,
            headers=headers
        )
        
        if login_response.status_code == 200:
            print("✅ Login endpoint working")
            login_result = login_response.json()
            if login_result.get('success'):
                print("✅ Login successful")
                token = login_result.get('token')
                if token:
                    print(f"✅ Auth token received: {token[:20]}...")
                    return True
                else:
                    print("❌ No auth token received")
                    return False
            else:
                print(f"❌ Login failed: {login_result.get('error')}")
                return False
        else:
            print(f"❌ Login endpoint failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        return False

def test_database_models():
    """Test database models"""
    print("\n🗄️ Testing Database Models...")
    
    try:
        # Test User model
        farmer_count = User.objects.filter(user_type='farmer').count()
        print(f"✅ Farmers in database: {farmer_count}")
        
        # Test Product model
        product_count = Product.objects.count()
        print(f"✅ Products in database: {product_count}")
        
        # Test Equipment model
        equipment_count = Equipment.objects.count()
        print(f"✅ Equipment in database: {equipment_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Running Complete System Fix Test\n")
    
    tests = [
        ("CSRF Configuration", test_csrf_configuration),
        ("API Endpoints", test_api_endpoints),
        ("Database Models", test_database_models),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with error: {str(e)}")
            results.append((test_name, False))
    
    print("\n📋 Test Results Summary:")
    all_passed = True
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {test_name}: {status}")
        if not result:
            all_passed = False
    
    if all_passed:
        print("\n🎉 All tests passed! The system should work correctly now.")
        print("\n📝 Next steps:")
        print("1. Restart Django server: python manage.py runserver")
        print("2. Restart React frontend: npm start")
        print("3. Clear browser cache and cookies")
        print("4. Try adding products/equipment through the web interface")
    else:
        print("\n⚠️ Some tests failed. Please check the issues above.")

if __name__ == "__main__":
    main()
