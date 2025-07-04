#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User

def create_test_users():
    """Create test users for different user types"""
    
    print("🔄 Creating test users...")
    
    # Create farmer user
    if not User.objects.filter(username='farmer').exists():
        farmer = User.objects.create_user(
            username='farmer',
            email='farmer@example.com',
            password='password123',
            user_type='farmer',
            first_name='John',
            last_name='Farmer'
        )
        print("✅ Created farmer user: farmer/password123")
    else:
        print("ℹ️ Farmer user already exists")
    
    # Create buyer user
    if not User.objects.filter(username='buyer').exists():
        buyer = User.objects.create_user(
            username='buyer',
            email='buyer@example.com',
            password='password123',
            user_type='buyer',
            first_name='Jane',
            last_name='Buyer'
        )
        print("✅ Created buyer user: buyer/password123")
    else:
        print("ℹ️ Buyer user already exists")
    
    # Create transporter user
    if not User.objects.filter(username='transporter').exists():
        transporter = User.objects.create_user(
            username='transporter',
            email='transporter@example.com',
            password='password123',
            user_type='transporter',
            first_name='Mike',
            last_name='Transport'
        )
        print("✅ Created transporter user: transporter/password123")
    else:
        print("ℹ️ Transporter user already exists")
    
    # Create equipment provider user
    if not User.objects.filter(username='equipment').exists():
        equipment = User.objects.create_user(
            username='equipment',
            email='equipment@example.com',
            password='password123',
            user_type='equipment_provider',
            first_name='Sarah',
            last_name='Equipment'
        )
        print("✅ Created equipment provider user: equipment/password123")
    else:
        print("ℹ️ Equipment provider user already exists")
    
    print("\n🎉 Test users created successfully!")
    print("\n📋 Login credentials:")
    print("   Farmer: farmer/password123")
    print("   Buyer: buyer/password123")
    print("   Transporter: transporter/password123")
    print("   Equipment: equipment/password123")

if __name__ == '__main__':
    create_test_users()
