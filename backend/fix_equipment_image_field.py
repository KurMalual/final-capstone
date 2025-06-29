#!/usr/bin/env python
"""
Script to fix Equipment image field in database
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from equipment.models import Equipment

def fix_equipment_image_field():
    """Fix Equipment image field in database"""
    print("🔧 Fixing Equipment image field...")
    
    try:
        # Step 1: Create migration to add image field (nullable first)
        print("📝 Step 1: Creating migration to add image field...")
        execute_from_command_line(['manage.py', 'makemigrations', 'equipment', '--name', 'add_equipment_image'])
        
        # Step 2: Apply the migration
        print("🚀 Step 2: Applying migration...")
        execute_from_command_line(['manage.py', 'migrate', 'equipment'])
        
        # Step 3: Check if we have any equipment without images
        print("📊 Step 3: Checking existing equipment...")
        equipment_count = Equipment.objects.count()
        print(f"Found {equipment_count} existing equipment items")
        
        if equipment_count > 0:
            print("⚠️  Note: Existing equipment will need images added manually")
            print("   The image field is now available in the database")
        
        print("✅ Equipment image field added successfully!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    print("🏗️  Equipment Image Field Fix")
    print("=" * 40)
    
    success = fix_equipment_image_field()
    
    if success:
        print("\n🎉 Database updated successfully!")
        print("📸 You can now upload equipment images!")
        print("\n💡 Next steps:")
        print("   1. Restart your Django server")
        print("   2. Try uploading equipment with images")
        print("   3. Existing equipment may need images added")
    else:
        print("\n💥 Fix failed. Please check the errors above.")
