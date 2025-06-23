#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.urls import reverse
from django.test import Client
from django.contrib.auth import get_user_model
import json

def test_url_routing():
    print("🔍 Testing URL Routing...")
    
    client = Client()
    User = get_user_model()
    
    try:
        # Test if farmer user exists
        farmer = User.objects.get(username='Farmer')
        print(f"✅ Farmer user found: {farmer.username}")
        
        # Test login
        login_data = {
            'username': 'Farmer',
            'password': 'farmer123'
        }
        
        login_response = client.post('/api/auth/login/', login_data)
        print(f"🔐 Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            # Get the token from login response
            login_result = json.loads(login_response.content)
            token = login_result.get('token')
            
            if token:
                headers = {'HTTP_AUTHORIZATION': f'Token {token}'}
                print(f"🎫 Token obtained: {token[:20]}...")
                
                # Test various endpoints
                endpoints_to_test = [
                    '/api/products/',
                    '/api/products/my_products/',
                    '/api/products/orders/',
                    '/api/equipment/',
                    '/api/transports/available_jobs/',
                    '/api/weather/data/current/?location=Juba',
                    '/api/education/videos/',
                ]
                
                for endpoint in endpoints_to_test:
                    try:
                        response = client.get(endpoint, **headers)
                        status_icon = "✅" if response.status_code == 200 else "❌"
                        print(f"{status_icon} {endpoint} → {response.status_code}")
                        
                        if response.status_code == 404:
                            print(f"   📝 404 Error: Endpoint not found")
                        elif response.status_code == 500:
                            print(f"   📝 500 Error: Server error")
                            
                    except Exception as e:
                        print(f"❌ {endpoint} → Error: {str(e)}")
                        
            else:
                print("❌ No token received from login")
        else:
            print(f"❌ Login failed: {login_response.content}")
            
    except User.DoesNotExist:
        print("❌ Farmer user not found")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    test_url_routing()
