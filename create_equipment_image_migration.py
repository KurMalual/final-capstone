#!/usr/bin/env python
"""
Script to create and apply migration for adding image field to Equipment model
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

def create_and_apply_migration():
    """Create and apply migration for Equipment image field"""
    print("🔧 Creating migration for Equipment image field...")
    
    try:
        # Create migration
        print("📝 Creating migration...")
        execute_from_command_line(['manage.py', 'makemigrations', 'equipment'])
        
        # Apply migration
        print("🚀 Applying migration...")
        execute_from_command_line(['manage.py', 'migrate', 'equipment'])
        
        print("✅ Migration completed successfully!")
        print("📸 Equipment model now has image field in database")
        
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    print("🏗️  Equipment Image Field Migration")
    print("=" * 50)
    
    success = create_and_apply_migration()
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("You can now upload equipment images!")
    else:
        print("\n💥 Migration failed. Please check the errors above.")
