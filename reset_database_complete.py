import os
import shutil
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and show the result"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            if result.stdout.strip():
                print(f"Output: {result.stdout.strip()}")
        else:
            print(f"❌ {description} failed")
            if result.stderr.strip():
                print(f"Error: {result.stderr.strip()}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error during {description}: {e}")
        return False

def reset_database():
    """Complete database and migration reset"""
    
    print("🚀 Starting complete database reset...")
    
    # 1. Delete the database file
    db_file = Path("db.sqlite3")
    if db_file.exists():
        print("🗑️ Deleting existing database...")
        db_file.unlink()
        print("✅ Database deleted")
    
    # 2. Delete migration files (keep __init__.py files)
    apps = ['users', 'products', 'equipment', 'transports', 'weather']
    
    for app in apps:
        migrations_dir = Path(app) / "migrations"
        if migrations_dir.exists():
            print(f"🗑️ Cleaning migrations for {app}...")
            for file in migrations_dir.glob("0*.py"):
                file.unlink()
                print(f"   Deleted {file.name}")
    
    # 3. Create fresh migrations
    print("\n📝 Creating fresh migrations...")
    for app in apps:
        run_command(f"python manage.py makemigrations {app}", f"Creating migrations for {app}")
    
    # 4. Apply all migrations
    run_command("python manage.py migrate", "Applying all migrations")
    
    # 5. Create superuser (optional)
    print("\n👤 You can now create a superuser with: python manage.py createsuperuser")
    
    print("\n🎉 Database reset completed successfully!")
    print("Your Django project should now work without migration errors.")

if __name__ == '__main__':
    reset_database()
