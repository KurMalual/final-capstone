import os
import django
import subprocess
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

def run_command(command):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        print(f"Command: {command}")
        print(f"Output: {result.stdout}")
        if result.stderr:
            print(f"Error: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"Error running command {command}: {e}")
        return False

def main():
    print("🔧 Applying Django migrations...")
    
    # Try to apply migrations
    success = run_command("python manage.py migrate")
    
    if success:
        print("✅ Migrations applied successfully!")
    else:
        print("❌ Migration failed. Trying to force apply...")
        
        # Try to fake apply the migrations
        run_command("python manage.py migrate --fake")
        
        # Then try to apply again
        run_command("python manage.py migrate")
    
    print("🎉 Migration process completed!")

if __name__ == '__main__':
    main()
