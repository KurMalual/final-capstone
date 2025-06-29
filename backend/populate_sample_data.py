import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User
from products.models import Product, Order
from equipment.models import Equipment, EquipmentRental
from transports.models import TransportationRequest
from weather.models import WeatherData, WeatherAlert

def create_sample_data():
    """Create sample data for testing"""
    
    print("Creating sample users...")
    
    # Create sample users
    farmer1 = User.objects.create_user(
        username='farmer1',
        email='farmer1@example.com',
        password='password123',
        user_type='farmer',
        first_name='John',
        last_name='Farmer',
        location='Central Valley',
        phone_number='+1234567890'
    )
    
    farmer2 = User.objects.create_user(
        username='farmer2',
        email='farmer2@example.com',
        password='password123',
        user_type='farmer',
        first_name='Jane',
        last_name='Smith',
        location='North County',
        phone_number='+1234567891'
    )
    
    buyer1 = User.objects.create_user(
        username='buyer1',
        email='buyer1@example.com',
        password='password123',
        user_type='buyer',
        first_name='Mike',
        last_name='Johnson',
        location='City Center',
        phone_number='+1234567892'
    )
    
    transporter1 = User.objects.create_user(
        username='transporter1',
        email='transporter1@example.com',
        password='password123',
        user_type='transporter',
        first_name='Bob',
        last_name='Transport',
        location='Highway District',
        phone_number='+1234567893'
    )
    
    equipment_seller1 = User.objects.create_user(
        username='equipment1',
        email='equipment1@example.com',
        password='password123',
        user_type='equipment_seller',
        first_name='Alice',
        last_name='Equipment',
        location='Industrial Zone',
        phone_number='+1234567894'
    )
    
    print("✓ Created sample users")
    
    # Create sample products
    print("Creating sample products...")
    
    Product.objects.create(
        name='Fresh Tomatoes',
        category='vegetables',
        description='Organic tomatoes grown without pesticides. Perfect for salads and cooking.',
        price=Decimal('3.50'),
        quantity=500,
        unit='kg',
        farmer=farmer1,
        location='Central Valley',
        harvest_date=datetime.now().date(),
        is_available=True
    )
    
    Product.objects.create(
        name='Sweet Corn',
        category='vegetables',
        description='Fresh sweet corn harvested this morning. Great for grilling or boiling.',
        price=Decimal('2.00'),
        quantity=200,
        unit='pieces',
        farmer=farmer1,
        location='Central Valley',
        harvest_date=datetime.now().date(),
        is_available=True
    )
    
    Product.objects.create(
        name='Organic Apples',
        category='fruits',
        description='Crisp and sweet organic apples. Perfect for snacking or baking.',
        price=Decimal('4.00'),
        quantity=300,
        unit='kg',
        farmer=farmer2,
        location='North County',
        harvest_date=datetime.now().date() - timedelta(days=2),
        is_available=True
    )
    
    Product.objects.create(
        name='Fresh Milk',
        category='dairy',
        description='Fresh cow milk from grass-fed cows. Rich in nutrients.',
        price=Decimal('1.50'),
        quantity=100,
        unit='liters',
        farmer=farmer2,
        location='North County',
        harvest_date=datetime.now().date(),
        is_available=True
    )
    
    print("✓ Created sample products")
    
    # Create sample equipment
    print("Creating sample equipment...")
    
    Equipment.objects.create(
        name='John Deere Tractor 5075E',
        equipment_type='tractor',
        description='Powerful tractor suitable for medium to large farms. 75HP engine.',
        daily_rate=Decimal('150.00'),
        owner=equipment_seller1,
        location='Industrial Zone',
        is_available=True
    )
    
    Equipment.objects.create(
        name='Combine Harvester',
        equipment_type='harvester',
        description='Efficient combine harvester for grain crops. Can handle wheat, corn, and soybeans.',
        daily_rate=Decimal('300.00'),
        owner=equipment_seller1,
        location='Industrial Zone',
        is_available=True
    )
    
    Equipment.objects.create(
        name='Irrigation System',
        equipment_type='irrigation',
        description='Complete drip irrigation system for efficient water usage.',
        daily_rate=Decimal('75.00'),
        owner=equipment_seller1,
        location='Industrial Zone',
        is_available=True
    )
    
    print("✓ Created sample equipment")
    
    # Create sample transportation requests
    print("Creating sample transportation requests...")
    
    TransportationRequest.objects.create(
        requester=farmer1,
        pickup_location='Central Valley Farm',
        delivery_location='City Market',
        cargo_description='500kg fresh tomatoes',
        weight=Decimal('500.00'),
        pickup_date=datetime.now() + timedelta(days=1),
        budget=Decimal('200.00'),
        status='pending'
    )
    
    TransportationRequest.objects.create(
        requester=farmer2,
        pickup_location='North County Farm',
        delivery_location='Supermarket Chain',
        cargo_description='300kg organic apples',
        weight=Decimal('300.00'),
        pickup_date=datetime.now() + timedelta(days=2),
        budget=Decimal('150.00'),
        status='pending'
    )
    
    print("✓ Created sample transportation requests")
    
    # Create sample weather data
    print("Creating sample weather data...")
    
    WeatherData.objects.create(
        location='Central Valley',
        temperature=25.5,
        humidity=65.0,
        rainfall=0.0,
        wind_speed=12.0,
        weather_condition='Clear',
        date=datetime.now()
    )
    
    WeatherData.objects.create(
        location='North County',
        temperature=23.0,
        humidity=70.0,
        rainfall=2.5,
        wind_speed=8.0,
        weather_condition='Cloudy',
        date=datetime.now()
    )
    
    # Create sample weather alerts
    WeatherAlert.objects.create(
        location='Central Valley',
        alert_type='heat',
        message='High temperatures expected for the next 3 days. Ensure adequate irrigation for crops.',
        severity='medium',
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=3),
        is_active=True
    )
    
    print("✓ Created sample weather data and alerts")
    
    print("\n✅ Sample data creation complete!")
    print("\nSample login credentials:")
    print("Farmer: farmer1 / password123")
    print("Buyer: buyer1 / password123") 
    print("Transporter: transporter1 / password123")
    print("Equipment Seller: equipment1 / password123")

if __name__ == "__main__":
    create_sample_data()
