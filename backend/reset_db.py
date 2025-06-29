import os
import sqlite3
import shutil
from pathlib import Path

def reset_database():
    """Reset the database and migrations"""
    
    # Get the backend directory
    backend_dir = Path(__file__).parent
    
    # Remove the database file
    db_file = backend_dir / 'db.sqlite3'
    if db_file.exists():
        os.remove(db_file)
        print("✓ Removed existing database")
    
    # Remove migration files (keep __init__.py)
    apps = ['users', 'products', 'equipment', 'transports', 'weather']
    
    for app in apps:
        migrations_dir = backend_dir / app / 'migrations'
        if migrations_dir.exists():
            for file in migrations_dir.iterdir():
                if file.name != '__init__.py' and file.name != '__pycache__':
                    if file.is_file():
                        os.remove(file)
                    elif file.is_dir():
                        shutil.rmtree(file)
            print(f"✓ Cleaned migrations for {app}")
    
    print("\n✓ Database reset complete!")
    print("\nNext steps:")
    print("1. Run: python manage.py makemigrations")
    print("2. Run: python manage.py migrate")
    print("3. Run: python manage.py createsuperuser")
    print("4. Run: python manage.py runserver")

if __name__ == "__main__":
    reset_database()
