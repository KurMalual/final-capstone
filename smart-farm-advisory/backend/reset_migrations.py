#!/usr/bin/env python
import os
import shutil
from pathlib import Path

def reset_migrations():
    """Reset all migrations except __init__.py files"""
    
    print("🔄 Resetting migrations...")
    
    # List of apps to reset
    apps = ['users', 'products', 'equipment', 'transports', 'weather', 'education']
    
    for app in apps:
        migrations_dir = Path(f"{app}/migrations")
        if migrations_dir.exists():
            print(f"Cleaning {app} migrations...")
            
            # Remove all migration files except __init__.py
            for file in migrations_dir.glob("*.py"):
                if file.name != "__init__.py":
                    file.unlink()
                    print(f"  Removed {file.name}")
            
            # Remove __pycache__ directory
            pycache_dir = migrations_dir / "__pycache__"
            if pycache_dir.exists():
                shutil.rmtree(pycache_dir)
                print(f"  Removed __pycache__")
    
    # Remove the database file
    db_file = Path("db.sqlite3")
    if db_file.exists():
        db_file.unlink()
        print("🗑️ Removed database file")
    
    print("✅ Migration reset completed!")
    print("Now run: python manage.py makemigrations && python manage.py migrate")

if __name__ == '__main__':
    reset_migrations()
