import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User

def check_user_fields():
    """Check what fields the User model actually has"""
    
    print("🔍 Checking User model fields...")
    
    # Get all field names
    field_names = [field.name for field in User._meta.get_fields()]
    
    print("\n📋 Available fields in User model:")
    for field_name in sorted(field_names):
        print(f"  - {field_name}")
    
    print(f"\n📊 Total fields: {len(field_names)}")
    
    # Check if it's using Django's built-in User model
    print(f"\n🏗️ User model class: {User}")
    print(f"📍 Model location: {User.__module__}")

if __name__ == '__main__':
    check_user_fields()
