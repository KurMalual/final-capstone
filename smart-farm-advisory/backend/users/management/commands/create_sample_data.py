from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product, Order
from equipment.models import Equipment, EquipmentRental
from transports.models import TransportationRequest
from weather.models import WeatherData, WeatherAlert
from datetime import datetime, timedelta
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for the Smart Farm Connect platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample data...'))
        
        # Create sample users
        self.create_users()
        
        # Create sample products
        self.create_products()
        
        # Create sample equipment
        self.create_equipment()
        
        # Create sample transport requests
        self.create_transport_requests()
        
        # Create sample weather data
        self.create_weather_data()
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write(self.style.WARNING('Login credentials:'))
        self.stdout.write('Farmer: farmer1 / password123')
        self.stdout.write('Buyer: buyer1 / password123')
        self.stdout.write('Transporter: transporter1 / password123')
        self.stdout.write('Equipment Seller: equipment1 / password123')

    def create_users(self):
        # Create farmers
        farmer1, created = User.objects.get_or_create(
            username='farmer1',
            defaults={
                'email': 'farmer1@example.com',
                'first_name': 'John',
                'last_name': 'Farmer',
                'user_type': 'farmer',
                'location': 'Juba',
                'phone_number': '+211123456789'
            }
        )
        if created:
            farmer1.set_password('password123')
            farmer1.save()

        farmer2, created = User.objects.get_or_create(
            username='farmer2',
            defaults={
                'email': 'farmer2@example.com',
                'first_name': 'Mary',
                'last_name': 'Agricultor',
                'user_type': 'farmer',
                'location': 'Wau',
                'phone_number': '+211123456790'
            }
        )
        if created:
            farmer2.set_password('password123')
            farmer2.save()

        # Create buyers
        buyer1, created = User.objects.get_or_create(
            username='buyer1',
            defaults={
                'email': 'buyer1@example.com',
                'first_name': 'Sarah',
                'last_name': 'Market',
                'user_type': 'buyer',
                'location': 'Juba',
                'phone_number': '+211123456791'
            }
        )
        if created:
            buyer1.set_password('password123')
            buyer1.save()

        # Create transporter
        transporter1, created = User.objects.get_or_create(
            username='transporter1',
            defaults={
                'email': 'transporter1@example.com',
                'first_name': 'David',
                'last_name': 'Transport',
                'user_type': 'transporter',
                'location': 'Malakal',
                'phone_number': '+211123456792'
            }
        )
        if created:
            transporter1.set_password('password123')
            transporter1.save()

        # Create equipment seller
        equipment1, created = User.objects.get_or_create(
            username='equipment1',
            defaults={
                'email': 'equipment1@example.com',
                'first_name': 'Ahmed',
                'last_name': 'Equipment',
                'user_type': 'equipment_seller',
                'location': 'Yei',
                'phone_number': '+211123456793'
            }
        )
        if created:
            equipment1.set_password('password123')
            equipment1.save()

        self.stdout.write('✓ Users created')

    def create_products(self):
        farmer1 = User.objects.get(username='farmer1')
        farmer2 = User.objects.get(username='farmer2')

        products_data = [
            {
                'name': 'Fresh Tomatoes',
                'category': 'vegetables',
                'description': 'Organic red tomatoes, perfect for cooking and salads. Grown without pesticides in fertile South Sudanese soil.',
                'price': Decimal('3.50'),
                'quantity': 500,
                'unit': 'kg',
                'farmer': farmer1,
                'location': 'Juba',
                'harvest_date': datetime.now().date(),
            },
            {
                'name': 'Sweet Corn',
                'category': 'vegetables',
                'description': 'Fresh sweet corn harvested this morning. Perfect for grilling, boiling, or making traditional dishes.',
                'price': Decimal('2.00'),
                'quantity': 300,
                'unit': 'pieces',
                'farmer': farmer1,
                'location': 'Juba',
                'harvest_date': datetime.now().date(),
            },
            {
                'name': 'Organic Mangoes',
                'category': 'fruits',
                'description': 'Sweet and juicy mangoes from our organic farm. Rich in vitamins and perfect for fresh consumption.',
                'price': Decimal('4.00'),
                'quantity': 200,
                'unit': 'kg',
                'farmer': farmer2,
                'location': 'Wau',
                'harvest_date': datetime.now().date() - timedelta(days=1),
            },
            {
                'name': 'Fresh Milk',
                'category': 'dairy',
                'description': 'Fresh cow milk from grass-fed cattle. Rich in nutrients and delivered daily.',
                'price': Decimal('1.50'),
                'quantity': 100,
                'unit': 'liters',
                'farmer': farmer2,
                'location': 'Wau',
                'harvest_date': datetime.now().date(),
            },
            {
                'name': 'White Sorghum',
                'category': 'grains',
                'description': 'High-quality white sorghum grain, perfect for traditional South Sudanese dishes.',
                'price': Decimal('1.20'),
                'quantity': 1000,
                'unit': 'kg',
                'farmer': farmer1,
                'location': 'Juba',
                'harvest_date': datetime.now().date() - timedelta(days=5),
            },
            {
                'name': 'Groundnuts',
                'category': 'other',
                'description': 'Fresh groundnuts (peanuts) perfect for cooking oil production or direct consumption.',
                'price': Decimal('2.50'),
                'quantity': 400,
                'unit': 'kg',
                'farmer': farmer2,
                'location': 'Wau',
                'harvest_date': datetime.now().date() - timedelta(days=3),
            }
        ]

        for product_data in products_data:
            Product.objects.get_or_create(
                name=product_data['name'],
                farmer=product_data['farmer'],
                defaults=product_data
            )

        self.stdout.write('✓ Products created')

    def create_equipment(self):
        equipment_seller = User.objects.get(username='equipment1')

        equipment_data = [
            {
                'name': 'John Deere Tractor 5075E',
                'equipment_type': 'tractor',
                'description': 'Powerful 75HP tractor suitable for medium to large farms. Perfect for plowing, planting, and harvesting.',
                'daily_rate': Decimal('150.00'),
                'owner': equipment_seller,
                'location': 'Yei',
            },
            {
                'name': 'Combine Harvester',
                'equipment_type': 'harvester',
                'description': 'Efficient combine harvester for grain crops. Can handle sorghum, wheat, and other cereals.',
                'daily_rate': Decimal('300.00'),
                'owner': equipment_seller,
                'location': 'Yei',
            },
            {
                'name': 'Drip Irrigation System',
                'equipment_type': 'irrigation',
                'description': 'Complete drip irrigation system for water-efficient farming. Includes pumps and distribution network.',
                'daily_rate': Decimal('75.00'),
                'owner': equipment_seller,
                'location': 'Yei',
            },
            {
                'name': 'Seed Planter',
                'equipment_type': 'planter',
                'description': 'Precision seed planter for optimal crop spacing and depth control.',
                'daily_rate': Decimal('100.00'),
                'owner': equipment_seller,
                'location': 'Yei',
            }
        ]

        for equipment_item in equipment_data:
            Equipment.objects.get_or_create(
                name=equipment_item['name'],
                owner=equipment_item['owner'],
                defaults=equipment_item
            )

        self.stdout.write('✓ Equipment created')

    def create_transport_requests(self):
        farmer1 = User.objects.get(username='farmer1')
        farmer2 = User.objects.get(username='farmer2')

        transport_data = [
            {
                'requester': farmer1,
                'pickup_location': 'Juba Central Farm',
                'delivery_location': 'Juba Main Market',
                'cargo_description': '500kg fresh tomatoes and vegetables',
                'weight': Decimal('500.00'),
                'pickup_date': datetime.now() + timedelta(days=1),
                'budget': Decimal('200.00'),
                'status': 'pending'
            },
            {
                'requester': farmer2,
                'pickup_location': 'Wau Agricultural Zone',
                'delivery_location': 'Wau City Market',
                'cargo_description': '300kg organic mangoes and dairy products',
                'weight': Decimal('300.00'),
                'pickup_date': datetime.now() + timedelta(days=2),
                'budget': Decimal('150.00'),
                'status': 'pending'
            }
        ]

        for transport_item in transport_data:
            TransportationRequest.objects.get_or_create(
                requester=transport_item['requester'],
                pickup_location=transport_item['pickup_location'],
                delivery_location=transport_item['delivery_location'],
                defaults=transport_item
            )

        self.stdout.write('✓ Transport requests created')

    def create_weather_data(self):
        cities = ['Juba', 'Wau', 'Malakal', 'Yei', 'Aweil', 'Bentiu', 'Bor', 'Torit']
        weather_conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny']

        for city in cities:
            # Create current weather data
            weather_data = {
                'location': city,
                'temperature': round(random.uniform(25, 40), 1),
                'humidity': round(random.uniform(40, 85), 1),
                'rainfall': round(random.uniform(0, 10), 1),
                'wind_speed': round(random.uniform(5, 25), 1),
                'weather_condition': random.choice(weather_conditions),
                'date': datetime.now()
            }

            WeatherData.objects.get_or_create(
                location=city,
                date__date=datetime.now().date(),
                defaults=weather_data
            )

        # Create some weather alerts
        alert_data = [
            {
                'location': 'Juba',
                'alert_type': 'heat',
                'message': 'High temperatures expected for the next 3 days. Ensure adequate irrigation for crops and provide shade for livestock.',
                'severity': 'medium',
                'start_date': datetime.now(),
                'end_date': datetime.now() + timedelta(days=3),
                'is_active': True
            },
            {
                'location': 'Wau',
                'alert_type': 'rain',
                'message': 'Heavy rainfall expected. Protect harvested crops and ensure proper drainage in fields.',
                'severity': 'high',
                'start_date': datetime.now(),
                'end_date': datetime.now() + timedelta(days=2),
                'is_active': True
            }
        ]

        for alert in alert_data:
            WeatherAlert.objects.get_or_create(
                location=alert['location'],
                alert_type=alert['alert_type'],
                start_date__date=alert['start_date'].date(),
                defaults=alert
            )

        self.stdout.write('✓ Weather data created')
