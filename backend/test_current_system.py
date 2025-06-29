#!/usr/bin/env python3

import os
import sys
import django
import requests
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Product
from equipment.models import Equipment

User = get_user_model()

def test_system():
    print("🚀 Testing Current System Status")
    print("=" * 50)
    
    # Test database
    print("\n🗄️ Database Status:")
    try:
        users = User.objects.all()
        products = Product.objects.all()
        equipment = Equipment.objects.all()
        
        print(f"✅ Users: {users.count()}")
        print(f"✅ Products: {products.count()}")
        print(f"✅ Equipment: {equipment.count()}")
        
        # Show sample users
        print("\n👥 Sample Users:")
        for user in users[:3]:
            print(f"  - {user.username} ({user.user_type})")
            
    except Exception as e:
        print(f"❌ Database error: {e}")
    
    # Test API endpoints
    print("\n🌐 API Endpoints:")
    base_url = "http://localhost:8000"
    
    endpoints = [
        "/api/auth/csrf/",
        "/api/products/",
        "/api/equipment/",
        "/api/users/profile/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            status = "✅" if response.status_code < 400 else "❌"
            print(f"  {status} {endpoint} - {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"  ❌ {endpoint} - Server not running")
        except Exception as e:
            print(f"  ❌ {endpoint} - {e}")
    
    print("\n📋 System Summary:")
    print("  - Django server should be running on port 8000")
    print("  - React frontend should be running on port 3000")
    print("  - Login should work with existing users")
    print("  - Forms should now submit properly")
    
    print(f"\n⏰ Test completed at: {datetime.now()}")

if __name__ == "__main__":
    test_system()
