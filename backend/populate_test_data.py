#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from equipment.models import Equipment
from transport.models import Transport
from marketplace.models import Product

def create_test_data():
    print("Creating test data...")
    
    # Create users if they don't exist
    try:
        equipment_seller = User.objects.get(username='equipmentseller')
    except User.DoesNotExist:
        equipment_seller = User.objects.create_user(
            username='equipmentseller',
            email='equipment@test.com',
            password='testpass123',
            first_name='Equipment',
            last_name='Seller',
            role='equipment_seller'
        )
        print("Created equipment seller user")
    
    try:
        transporter = User.objects.get(username='transporter1')
    except User.DoesNotExist:
        transporter = User.objects.create_user(
            username='transporter1',
            email='transport@test.com',
            password='testpass123',
            first_name='Transport',
            last_name='Owner',
            role='transporter'
        )
        print("Created transporter user")
    
    # Create sample equipment
    equipment_data = [
        {
            'name': 'Tractor - John Deere 5075E',
            'description': 'Powerful tractor suitable for plowing and harvesting. 75 HP engine.',
            'owner': equipment_seller,
            'available': True,
            'price_per_day': 150.00
        },
        {
            'name': 'Combine Harvester',
            'description': 'Modern combine harvester for grain crops. High efficiency cutting.',
            'owner': equipment_seller,
            'available': True,
            'price_per_day': 300.00
        },
        {
            'name': 'Irrigation System',
            'description': 'Sprinkler irrigation system for field watering. Covers 5 acres.',
            'owner': equipment_seller,
            'available': True,
            'price_per_day': 80.00
        }
    ]
    
    for eq_data in equipment_data:
        equipment, created = Equipment.objects.get_or_create(
            name=eq_data['name'],
            defaults=eq_data
        )
        if created:
            print(f"Created equipment: {equipment.name}")
    
    # Create sample transport vehicles
    transport_data = [
        {
            'vehicle_name': 'Pickup Truck - Toyota Hilux',
            'description': 'Reliable pickup truck for transporting agricultural products. Capacity: 2 tons',
            'owner': transporter,
            'available': True,
            'price_per_trip': 150.00
        },
        {
            'vehicle_name': 'Large Truck - Isuzu FVZ',
            'description': 'Heavy-duty truck for bulk transportation of crops and equipment. Capacity: 10 tons',
            'owner': transporter,
            'available': True,
            'price_per_trip': 500.00
        },
        {
            'vehicle_name': 'Refrigerated Van - Mitsubishi Canter',
            'description': 'Temperature-controlled vehicle for transporting fresh produce. Capacity: 5 tons',
            'owner': transporter,
            'available': True,
            'price_per_trip': 300.00
        }
    ]
    
    for trans_data in transport_data:
        transport, created = Transport.objects.get_or_create(
            vehicle_name=trans_data['vehicle_name'],
            owner=trans_data['owner'],
            defaults=trans_data
        )
        if created:
            print(f"Created transport: {transport.vehicle_name}")
    
    print("Test data creation completed!")

if __name__ == '__main__':
    create_test_data()
