import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User

def create_superuser():
    """Create a superuser for Django admin"""
    
    print("👑 Creating superuser...")
    
    # Check if superuser already exists
    if User.objects.filter(is_superuser=True).exists():
        print("✅ Superuser already exists")
        return
    
    # Create superuser
    superuser = User.objects.create_superuser(
        username='admin',
        email='admin@smartfarmconnect.ss',
        password='admin123',
        first_name='Admin',
        last_name='User',
        user_type='farmer'  # Default type
    )
    
    print("✅ Superuser created successfully!")
    print("\nAdmin credentials:")
    print("Username: admin")
    print("Password: admin123")
    print("Access Django admin at: http://127.0.0.1:8000/admin/")

if __name__ == '__main__':
    create_superuser()
