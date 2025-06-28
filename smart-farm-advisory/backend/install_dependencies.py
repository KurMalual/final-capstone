import subprocess
import sys

def install_packages():
    packages = [
        'dj-database-url==2.1.0',
        'python-decouple==3.8',
        'gunicorn==21.2.0',
        'whitenoise==6.6.0',
        'psycopg2-binary==2.9.9'
    ]
    
    for package in packages:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✅ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {package}: {e}")

if __name__ == "__main__":
    install_packages()
    print("\n🎉 All dependencies installed! You can now run 'python manage.py runserver'")
