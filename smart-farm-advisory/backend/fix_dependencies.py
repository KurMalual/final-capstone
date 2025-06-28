import subprocess
import sys
import os

def run_command(command, description):
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stderr:
            print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Installing missing dependencies for Smart Farm Advisory...")
    
    # Install Python packages
    packages = [
        'dj-database-url==2.1.0',
        'python-decouple==3.8',
        'gunicorn==21.2.0',
        'whitenoise==6.6.0',
        'psycopg2-binary==2.9.9'
    ]
    
    for package in packages:
        run_command(f'pip install {package}', f'Installing {package}')
    
    print("\n🎉 All dependencies installed!")
    print("\n📋 Next steps:")
    print("1. Run: python manage.py runserver")
    print("2. Test your app at http://localhost:8000")
    print("3. When ready to deploy, run the deployment script")

if __name__ == "__main__":
    main()
