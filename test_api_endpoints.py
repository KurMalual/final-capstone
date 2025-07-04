import requests
import json

def test_api_endpoints():
    """Test API endpoints directly"""
    
    base_url = "http://localhost:8000"
    
    print("=== Testing API Endpoints ===")
    
    # Test registration
    print("\n1. Testing Registration...")
    
    registration_data = {
        "username": "testuser456",
        "email": "testuser456@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "user_type": "farmer",
        "phone_number": "1234567890",
        "location": "Test Location"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/register/",
            json=registration_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Registration Status Code: {response.status_code}")
        print(f"Registration Response: {response.text}")
        
        if response.status_code == 201:
            print("✓ Registration successful")
        else:
            print("✗ Registration failed")
            
    except Exception as e:
        print(f"✗ Registration error: {e}")
    
    # Test login
    print("\n2. Testing Login...")
    
    login_data = {
        "username": "testuser456",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/login/",
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Login Status Code: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            print("✓ Login successful")
        else:
            print("✗ Login failed")
            
    except Exception as e:
        print(f"✗ Login error: {e}")
    
    # Test debug users endpoint
    print("\n3. Testing Debug Users Endpoint...")
    
    try:
        response = requests.get(f"{base_url}/api/auth/debug/users/")
        print(f"Debug Users Status Code: {response.status_code}")
        print(f"Debug Users Response: {response.text}")
        
    except Exception as e:
        print(f"✗ Debug users error: {e}")

if __name__ == "__main__":
    test_api_endpoints()
