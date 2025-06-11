import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User
from django.contrib.auth import authenticate

def test_user_creation():
    """Test user creation and authentication"""
    
    # Test data
    test_username = "testuser123"
    test_password = "testpass123"
    test_email = "test@example.com"
    
    print("=== Testing User Creation ===")
    
    # Delete existing test user if exists
    try:
        existing_user = User.objects.get(username=test_username)
        existing_user.delete()
        print(f"Deleted existing test user: {test_username}")
    except User.DoesNotExist:
        print("No existing test user found")
    
    # Create new user
    try:
        user = User.objects.create_user(
            username=test_username,
            email=test_email,
            password=test_password,
            first_name="Test",
            last_name="User",
            user_type="farmer"
        )
        print(f"✓ User created successfully: {user.username}")
        print(f"  - ID: {user.id}")
        print(f"  - Email: {user.email}")
        print(f"  - User Type: {user.user_type}")
        print(f"  - Password is set: {bool(user.password)}")
        print(f"  - Is active: {user.is_active}")
        
    except Exception as e:
        print(f"✗ Error creating user: {e}")
        return
    
    # Test authentication
    print("\n=== Testing Authentication ===")
    
    auth_user = authenticate(username=test_username, password=test_password)
    if auth_user:
        print(f"✓ Authentication successful for: {auth_user.username}")
    else:
        print("✗ Authentication failed")
        
        # Try to check what's wrong
        try:
            db_user = User.objects.get(username=test_username)
            print(f"User exists in DB: {db_user.username}")
            print(f"Password hash: {db_user.password[:20]}...")
            print(f"Check password manually: {db_user.check_password(test_password)}")
        except User.DoesNotExist:
            print("User not found in database")
    
    # List all users
    print("\n=== All Users in Database ===")
    users = User.objects.all()
    for user in users:
        print(f"- {user.username} ({user.user_type}) - Active: {user.is_active}")

if __name__ == "__main__":
    test_user_creation()
