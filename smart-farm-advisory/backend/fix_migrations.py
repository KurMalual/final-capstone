#!/usr/bin/env python
import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.core.management import execute_from_command_line

def fix_migrations():
    """Fix migration conflicts and apply all migrations"""
    
    print("🔧 Fixing migration conflicts...")
    
    # Step 1: Merge conflicting migrations
    try:
        print("Step 1: Merging conflicting migrations...")
        execute_from_command_line(['manage.py', 'makemigrations', '--merge', '--noinput'])
        print("✅ Migration conflicts resolved")
    except Exception as e:
        print(f"⚠️ Merge step completed with: {e}")
    
    # Step 2: Create new migrations for all apps
    try:
        print("Step 2: Creating new migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        print("✅ New migrations created")
    except Exception as e:
        print(f"⚠️ Makemigrations completed with: {e}")
    
    # Step 3: Apply all migrations
    try:
        print("Step 3: Applying all migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ All migrations applied successfully")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    print("🎉 Migration fix completed successfully!")
    return True

if __name__ == '__main__':
    fix_migrations()
