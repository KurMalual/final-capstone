#!/usr/bin/env python
import os
import sys
import django

# Set up Django with the correct settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.core.management import execute_from_command_line

def create_migration():
    print("Creating migration for Vehicle model...")
    try:
        # Create migrations for transports app
        execute_from_command_line(['manage.py', 'makemigrations', 'transports'])
        print("✅ Migration created successfully!")
        
        print("Applying migration...")
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migration applied successfully!")
        
        print("Creating superuser if needed...")
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            execute_from_command_line(['manage.py', 'createsuperuser', '--noinput', '--username=admin', '--email=admin@example.com'])
            print("✅ Superuser created!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_migration()
