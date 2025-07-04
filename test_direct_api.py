import requests
import json

def test_direct_api():
    """Test API endpoints directly with requests"""
    
    base_url = "http://localhost:8000"
    
    # Test registration
    print("\n=== Testing Registration ===")
    
    test_user = {
        "username": "testuser789",
        "email": "testuser789@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "user_type": "farmer",
        "phone_number": "1234567890",
        "location": "Test Location"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/register/",
            json=test_user,
            headers={
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_direct_api()
