#!/usr/bin/env python3

import os
import sys
import django
from django.conf import settings

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth import get_user_model
from equipment.models import Equipment
from equipment.serializers import EquipmentSerializer
import json

def test_equipment_creation():
    print("🧪 Testing Equipment Creation Fix...")
    
    User = get_user_model()
    
    # Get or create a test user
    try:
        user = User.objects.filter(user_type='equipment_seller').first()
        if not user:
            user = User.objects.filter(user_type='farmer').first()
        
        if not user:
            print("❌ No users found. Please create a user first.")
            return
        
        print(f"✅ Using test user: {user.username} ({user.user_type})")
        
        # Test data similar to what frontend sends
        test_data = {
            'name': 'Test Tractor',
            'equipment_type': 'tractor',
            'description': 'A reliable tractor for farming',
            'daily_rate': '25.50',
            'location': 'Juba'
        }
        
        print(f"📝 Test data: {json.dumps(test_data, indent=2)}")
        
        # Test serializer
        serializer = EquipmentSerializer(data=test_data)
        
        if serializer.is_valid():
            print("✅ Serializer validation passed")
            
            # Create equipment with owner
            equipment = serializer.save(owner=user)
            print(f"✅ Equipment created successfully!")
            print(f"   - ID: {equipment.id}")
            print(f"   - Name: {equipment.name}")
            print(f"   - Owner: {equipment.owner.username}")
            print(f"   - Type: {equipment.equipment_type}")
            print(f"   - Rate: ${equipment.daily_rate}/day")
            
            # Clean up test data
            equipment.delete()
            print("🧹 Test equipment cleaned up")
            
        else:
            print("❌ Serializer validation failed:")
            for field, errors in serializer.errors.items():
                print(f"   - {field}: {errors}")
        
        print("\n" + "="*50)
        print("🎯 Fix Summary:")
        print("✅ Added read_only_fields = ('owner',) to serializer")
        print("✅ Owner field will be set automatically in the view")
        print("✅ Frontend doesn't need to send owner field")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error during test: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_equipment_creation()
