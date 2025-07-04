import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth import get_user_model
from equipment.models import Equipment

User = get_user_model()

def test_equipment_creation():
    """Test equipment creation through API and direct database"""
    
    print("=== Testing Equipment Creation ===")
    
    # 1. Test direct database creation
    print("\n1. Testing Direct Database Creation...")
    try:
        # Get equipment seller user
        user = User.objects.filter(user_type='equipment_seller').first()
        if not user:
            print("❌ No equipment seller user found")
            return
        
        print(f"✅ Found equipment seller: {user.username}")
        
        # Create equipment directly in database
        equipment = Equipment.objects.create(
            name="Test Tractor",
            equipment_type="tractor",
            description="Test equipment for debugging",
            daily_rate=50.00,
            owner=user,
            location="Test Location"
        )
        
        print(f"✅ Equipment created successfully: {equipment.id}")
        
        # Clean up
        equipment.delete()
        print("✅ Test equipment cleaned up")
        
    except Exception as e:
        print(f"❌ Direct database creation failed: {e}")
    
    # 2. Test API authentication
    print("\n2. Testing API Authentication...")
    try:
        # Login to get token
        login_data = {
            "username": user.username,
            "password": "equipm123"  # Default password from sample data
        }
        
        response = requests.post(
            "http://localhost:8000/api/auth/login/",
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('access_token') or token_data.get('token')
            print(f"✅ Authentication successful, token: {token[:20]}...")
            
            # 3. Test equipment creation API
            print("\n3. Testing Equipment Creation API...")
            
            equipment_data = {
                "name": "API Test Bulldozer",
                "equipment_type": "tractor",
                "description": "For plowing and farming",
                "daily_rate": "75.50",
                "location": "Juba"
            }
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                "http://localhost:8000/api/equipment/",
                json=equipment_data,
                headers=headers
            )
            
            print(f"Equipment Creation Status: {response.status_code}")
            print(f"Equipment Creation Response: {response.text}")
            
            if response.status_code == 201:
                print("✅ Equipment created successfully via API")
                # Clean up
                equipment_id = response.json().get('id')
                if equipment_id:
                    Equipment.objects.filter(id=equipment_id).delete()
                    print("✅ API test equipment cleaned up")
            else:
                print("❌ Equipment creation via API failed")
                
        else:
            print("❌ Authentication failed")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")
    
    # 4. Test field validation
    print("\n4. Testing Field Validation...")
    try:
        # Test with missing required fields
        invalid_data = {
            "name": "",  # Empty name
            "equipment_type": "tractor",
            "description": "Test",
            "daily_rate": "invalid_rate",  # Invalid rate
            "location": "Test"
        }
        
        from equipment.serializers import EquipmentSerializer
        serializer = EquipmentSerializer(data=invalid_data)
        
        if serializer.is_valid():
            print("❌ Validation should have failed")
        else:
            print("✅ Validation correctly failed")
            print(f"Validation errors: {serializer.errors}")
            
    except Exception as e:
        print(f"❌ Validation test failed: {e}")
    
    # 5. Check equipment model fields
    print("\n5. Checking Equipment Model Fields...")
    try:
        from equipment.models import Equipment
        fields = [field.name for field in Equipment._meta.fields]
        print(f"Equipment model fields: {fields}")
        
        # Check field types
        for field in Equipment._meta.fields:
            print(f"  {field.name}: {field.__class__.__name__}")
            
    except Exception as e:
        print(f"❌ Model inspection failed: {e}")

if __name__ == "__main__":
    test_equipment_creation()
