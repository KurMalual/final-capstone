import os
import django
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User
from products.models import Product

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
            'role': 'farmer',
            'phone': '+211123456789',
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
            'role': 'buyer',
            'phone': '+211987654321',
            'location': 'Wau, South Sudan'
        }
    )
    
    if created:
        buyer.set_password('password123')
        buyer.save()
        print("✅ Created buyer user: buyer1")
    else:
        print("✅ Buyer user already exists")
    
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

if __name__ == '__main__':
    create_sample_data()
