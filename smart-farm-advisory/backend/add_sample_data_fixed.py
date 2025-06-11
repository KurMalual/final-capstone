import os
import django
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Product

def create_sample_data():
    """Create sample users and products"""
    
    print("🌱 Creating sample data...")
    
    # Create a farmer user (using Django's built-in User model)
    farmer, created = User.objects.get_or_create(
        username='farmer1',
        defaults={
            'email': 'farmer1@example.com',
            'first_name': 'John',
            'last_name': 'Farmer',
            'is_active': True,
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
            'is_active': True,
        }
    )
    
    if created:
        buyer.set_password('password123')
        buyer.save()
        print("✅ Created buyer user: buyer1")
    else:
        print("✅ Buyer user already exists")
    
    # Create an admin user
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_active': True,
            'is_staff': True,
            'is_superuser': True,
        }
    )
    
    if created:
        admin.set_password('admin123')
        admin.save()
        print("✅ Created admin user: admin")
    else:
        print("✅ Admin user already exists")
    
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
    print("Admin - Username: admin, Password: admin123")
    print("\nYou can now:")
    print("1. Login to test the dashboards")
    print("2. Access Django admin at http://127.0.0.1:8000/admin/")
    print("3. Test API endpoints")

if __name__ == '__main__':
    create_sample_data()
