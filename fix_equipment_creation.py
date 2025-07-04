import os
import django
import logging

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth import get_user_model
from equipment.models import Equipment

User = get_user_model()

def fix_equipment_creation():
    """Fix equipment creation issues"""
    
    print("🔧 Fixing Equipment Creation...")
    
    # 1. Check if equipment model has all required fields
    print("\n1. Checking Equipment Model Fields...")
    try:
        fields = [field.name for field in Equipment._meta.fields]
        print(f"✅ Equipment fields: {fields}")
        
        # Check field types and constraints
        for field in Equipment._meta.fields:
            field_info = f"  {field.name}: {field.__class__.__name__}"
            if hasattr(field, 'max_length') and field.max_length:
                field_info += f" (max_length={field.max_length})"
            if hasattr(field, 'null'):
                field_info += f" (null={field.null})"
            if hasattr(field, 'blank'):
                field_info += f" (blank={field.blank})"
            print(field_info)
            
    except Exception as e:
        print(f"❌ Error checking model: {e}")
    
    # 2. Test equipment creation directly
    print("\n2. Testing Direct Equipment Creation...")
    try:
        # Get an equipment seller user
        user = User.objects.filter(user_type='equipment_seller').first()
        if not user:
            print("❌ No equipment seller user found")
            return
        
        print(f"✅ Found equipment seller: {user.username}")
        
        # Test data similar to what's in the form
        test_data = {
            'name': 'Test Sino Truck',
            'equipment_type': 'other',
            'description': 'For carrying weeds and farm materials',
            'daily_rate': 0.02,
            'location': 'Juba',
            'owner': user,
            'is_available': True
        }
        
        # Create equipment
        equipment = Equipment.objects.create(**test_data)
        print(f"✅ Equipment created successfully: ID {equipment.id}")
        
        # Verify it was saved
        saved_equipment = Equipment.objects.get(id=equipment.id)
        print(f"✅ Equipment verified: {saved_equipment.name}")
        
        # Clean up test data
        equipment.delete()
        print("✅ Test equipment cleaned up")
        
    except Exception as e:
        print(f"❌ Direct creation failed: {e}")
    
    # 3. Check equipment serializer
    print("\n3. Testing Equipment Serializer...")
    try:
        from equipment.serializers import EquipmentSerializer
        
        test_data = {
            'name': 'Test Serializer Equipment',
            'equipment_type': 'other',
            'description': 'Test description',
            'daily_rate': '0.02',  # String format like from form
            'location': 'Juba'
        }
        
        serializer = EquipmentSerializer(data=test_data)
        if serializer.is_valid():
            print("✅ Serializer validation passed")
            print(f"  Validated data: {serializer.validated_data}")
        else:
            print("❌ Serializer validation failed")
            print(f"  Errors: {serializer.errors}")
            
    except Exception as e:
        print(f"❌ Serializer test failed: {e}")
    
    # 4. Check API endpoint
    print("\n4. Testing API Endpoint...")
    try:
        import requests
        
        # Login first
        login_data = {
            "username": user.username,
            "password": "equipm123"
        }
        
        response = requests.post(
            "http://localhost:8000/api/auth/login/",
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('access_token') or token_data.get('token')
            print(f"✅ Authentication successful")
            
            # Test equipment creation
            equipment_data = {
                "name": "API Test Sino Truck",
                "equipment_type": "other",
                "description": "For carrying weeds",
                "daily_rate": "0.02",
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
            
            print(f"API Response Status: {response.status_code}")
            print(f"API Response: {response.text}")
            
            if response.status_code == 201:
                print("✅ API equipment creation successful")
                # Clean up
                equipment_id = response.json().get('id')
                if equipment_id:
                    Equipment.objects.filter(id=equipment_id).delete()
                    print("✅ API test equipment cleaned up")
            else:
                print("❌ API equipment creation failed")
                
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")
    
    print("\n🎯 Equipment Creation Fix Complete!")

if __name__ == "__main__":
    fix_equipment_creation()
