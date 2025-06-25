#!/usr/bin/env python3
"""
Test the fixed API endpoints
"""

import requests
import json

def test_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing API Endpoints...")
    
    # Test CSRF endpoint (both paths)
    endpoints_to_test = [
        ("/api/auth/csrf/", "CSRF (auth)"),
        ("/api/users/csrf/", "CSRF (users)"),
        ("/api/auth/profile/", "Profile (auth)"),
        ("/api/users/profile/", "Profile (users)"),
        ("/api/products/orders/", "Product Orders"),
        ("/api/equipment/rental_requests/", "Equipment Rental Requests"),
        ("/api/equipment/active_rentals/", "Equipment Active Rentals"),
    ]
    
    session = requests.Session()
    
    for endpoint, name in endpoints_to_test:
        try:
            response = session.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                print(f"✅ {name}: Working (200)")
            elif response.status_code == 401:
                print(f"🔒 {name}: Requires auth (401) - Expected")
            elif response.status_code == 404:
                print(f"❌ {name}: Not Found (404)")
            else:
                print(f"⚠️  {name}: Status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {name}: Connection failed")
            break
        except Exception as e:
            print(f"❌ {name}: Error - {e}")

if __name__ == "__main__":
    test_endpoints()
