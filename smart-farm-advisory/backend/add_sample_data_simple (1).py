import os
import django
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User, Product

def create_sample_data():
    """Create sample users and products"""
    
    print("🌱 Creating sample data...")
    
    # Create a farmer user
    farmer, created = User.objects.get_or_create(
        username='farmer1',
        defaults={
            'email': 'farmer1@example.com',
            'first_name': 'John',
            'last_name': 'Farmer',
            'user_type': 'farmer',  # Changed from 'role' to 'user_type'
            'phone_number': '+211123456789',  # Changed from 'phone' to 'phone_number'
            'location': 'Juba, South Sudan'
        }
    )
    
    if created:
        farmer.set_password('password123')
        farmer.save()
        print("✅ Created farmer user: farmer1")
    else:
        print("✅ Farmer user already exists")
    
    # Create a buyer user
    buyer, created = User.objects.get_or_create(
        username='buyer1',
        defaults={
            'email': 'buyer1@example.com',
            'first_name': 'Jane',
            'last_name': 'Buyer',
            'user_type': 'buyer',  # Changed from 'role' to 'user_type'
            'phone_number': '+211987654321',  # Changed from 'phone' to 'phone_number'
            'location': 'Wau, South Sudan'
        }
    )
    
    if created:
        buyer.set_password('password123')
        buyer.save()
        print("✅ Created buyer user: buyer1")
    else:
        print("✅ Buyer user already exists")
    
    # Create an equipment seller
    equipment_seller, created = User.objects.get_or_create(
        username='equipment1',
        defaults={
            'email': 'equipment1@example.com',
            'first_name': 'Mike',
            'last_name': 'Equipment',
            'user_type': 'equipment_seller',
            'phone_number': '+211555666777',
            'location': 'Malakal, South Sudan'
        }
    )
    
    if created:
        equipment_seller.set_password('password123')
        equipment_seller.save()
        print("✅ Created equipment seller user: equipment1")
    else:
        print("✅ Equipment seller user already exists")
    
    # Create a transporter
    transporter, created = User.objects.get_or_create(
        username='transporter1',
        defaults={
            'email': 'transporter1@example.com',
            'first_name': 'David',
            'last_name': 'Transport',
            'user_type': 'transporter',
            'phone_number': '+211888999000',
            'location': 'Bentiu, South Sudan'
        }
    )
    
    if created:
        transporter.set_password('password123')
        transporter.save()
        print("✅ Created transporter user: transporter1")
    else:
        print("✅ Transporter user already exists")
    
    # Create sample products
    products_data = [
        {
            'name': 'Fresh Tomatoes',
            'category': 'vegetables',
            'description': 'Organic tomatoes grown in Juba',
            'price': 5.00,
            'quantity': 100,
            'unit': 'kg',
            'location': 'Juba',
        },
        {
            'name': 'Sweet Corn',
            'category': 'vegetables',
            'description': 'Fresh sweet corn from local farms',
            'price': 3.50,
            'quantity': 50,
            'unit': 'kg',
            'location': 'Juba',
        },
        {
            'name': 'Mangoes',
            'category': 'fruits',
            'description': 'Ripe mangoes ready for market',
            'price': 8.00,
            'quantity': 30,
            'unit': 'kg',
            'location': 'Juba',
        },
        {
            'name': 'White Sorghum',
            'category': 'grains',
            'description': 'High quality sorghum grain',
            'price': 12.00,
            'quantity': 200,
            'unit': 'kg',
            'location': 'Wau',
        },
        {
            'name': 'Groundnuts',
            'category': 'other',
            'description': 'Fresh groundnuts from Yei',
            'price': 15.00,
            'quantity': 75,
            'unit': 'kg',
            'location': 'Yei',
        }
    ]
    
    for product_data in products_data:
        product, created = Product.objects.get_or_create(
            name=product_data['name'],
            farmer=farmer,
            defaults={
                **product_data,
                'harvest_date': date.today() - timedelta(days=2)
            }
        )
        
        if created:
            print(f"✅ Created product: {product.name}")
        else:
            print(f"✅ Product already exists: {product.name}")
    
    print("\n🎉 Sample data created successfully!")
    print("\nLogin credentials:")
    print("Farmer - Username: farmer1, Password: password123")
    print("Buyer - Username: buyer1, Password: password123")
    print("Equipment Seller - Username: equipment1, Password: password123")
    print("Transporter - Username: transporter1, Password: password123")
    print("\nYou can now:")
    print("1. Login to the farmer dashboard to see products")
    print("2. Login to the buyer dashboard to browse marketplace")
    print("3. Access Django admin at http://127.0.0.1:8000/admin/")

if __name__ == '__main__':
    create_sample_data()
