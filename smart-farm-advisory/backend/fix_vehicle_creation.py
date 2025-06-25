#!/usr/bin/env python
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

def fix_vehicle_creation():
    print("🔧 Fixing Vehicle Creation...")
    
    # Check if Vehicle model exists
    try:
        from transports.models import Vehicle
        print("✅ Vehicle model found")
        
        # Check current vehicles
        vehicles = Vehicle.objects.all()
        print(f"📊 Current vehicles: {vehicles.count()}")
        
        # Check Vehicle model fields
        print("\n📋 Vehicle Model Fields:")
        for field in Vehicle._meta.fields:
            print(f"  - {field.name}: {field.__class__.__name__}")
            
    except Exception as e:
        print(f"❌ Error with Vehicle model: {e}")
    
    # Test vehicle creation
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Get a transporter user
        transporter = User.objects.filter(user_type='transporter').first()
        if transporter:
            print(f"✅ Found transporter: {transporter.username}")
            
            # Try creating a test vehicle
            test_vehicle = Vehicle.objects.create(
                owner=transporter,
                name="Test Vehicle",
                type="truck",
                capacity=1000,
                rate_per_km=2.50,
                description="Test vehicle for debugging"
            )
            print(f"✅ Test vehicle created: {test_vehicle.id}")
            
            # Clean up test vehicle
            test_vehicle.delete()
            print("✅ Test vehicle cleaned up")
            
        else:
            print("❌ No transporter user found")
            
    except Exception as e:
        print(f"❌ Error creating test vehicle: {e}")
    
    print("\n🧪 Testing Vehicle API endpoint...")
    try:
        import requests
        response = requests.get('http://127.0.0.1:8000/api/transports/vehicles/')
        print(f"✅ Vehicle API accessible: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📊 API returned {len(data)} vehicles")
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    fix_vehicle_creation()
