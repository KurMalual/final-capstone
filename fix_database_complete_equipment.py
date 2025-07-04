#!/usr/bin/env python
"""
Complete database fix for Equipment image field
"""
import os
import sys
import django
from django.core.management import execute_from_command_line
from django.db import connection

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

def check_table_structure():
    """Check current table structure"""
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(equipment_equipment);")
        columns = cursor.fetchall()
        print("📊 Current equipment_equipment table structure:")
        for col in columns:
            print(f"   - {col[1]} ({col[2]})")
        
        # Check if image column exists
        image_exists = any(col[1] == 'image' for col in columns)
        return image_exists

def fix_equipment_database():
    """Complete fix for equipment database"""
    print("🔧 Starting complete equipment database fix...")
    
    try:
        # Check current structure
        print("\n📋 Step 1: Checking current database structure...")
        image_exists = check_table_structure()
        
        if image_exists:
            print("✅ Image column already exists!")
            return True
        
        print("\n📝 Step 2: Creating migration for image field...")
        
        # Create migrations
        execute_from_command_line(['manage.py', 'makemigrations', 'equipment'])
        
        print("\n🚀 Step 3: Applying migrations...")
        
        # Apply migrations
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("\n📊 Step 4: Verifying changes...")
        image_exists_after = check_table_structure()
        
        if image_exists_after:
            print("✅ Image field added successfully!")
        else:
            print("❌ Image field was not added")
            return False
        
        print("\n🎉 Database fix completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during database fix: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    print("🏗️  Complete Equipment Database Fix")
    print("=" * 50)
    
    success = fix_equipment_database()
    
    if success:
        print("\n🎉 Database fix completed successfully!")
        print("\n📸 Equipment image field is now available!")
        print("\n💡 Next steps:")
        print("   1. Restart your Django server")
        print("   2. Try uploading equipment with images")
        print("   3. The image field is now in the database")
    else:
        print("\n💥 Database fix failed. Please check the errors above.")
        print("\n🔧 Manual steps:")
        print("   1. Run: python manage.py makemigrations equipment")
        print("   2. Run: python manage.py migrate")
        print("   3. Restart Django server")
