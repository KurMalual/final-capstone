import requests
import json

def test_endpoints():
    """Test all API endpoints"""
    
    base_url = "http://localhost:8000"
    
    print("=== Testing API Endpoints ===")
    
    # Test API root
    print("\n1. Testing API Root...")
    try:
        response = requests.get(f"{base_url}/api/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test products endpoint (public)
    print("\n2. Testing Products Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/products/")
        print(f"Status: {response.status_code}")
        print(f"Products count: {len(response.json())}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test equipment endpoint (public)
    print("\n3. Testing Equipment Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/equipment/")
        print(f"Status: {response.status_code}")
        print(f"Equipment count: {len(response.json())}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test weather endpoint (public)
    print("\n4. Testing Weather Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/weather/data/")
        print(f"Status: {response.status_code}")
        print(f"Weather data count: {len(response.json())}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test registration
    print("\n5. Testing Registration...")
    test_user = {
        "username": "testuser123",
        "email": "test@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "user_type": "farmer",
        "location": "Juba"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            print("✓ Registration successful")
        else:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_endpoints()
