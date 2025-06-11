import os
import django
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from users.models import User  # Import the custom User model
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
            'is_active': True,
            'user_type': 'farmer',  # Using correct field name
            'phone_number': '+211123456789',  # Using correct field name
            'location': 'Juba',
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
            'user_type': 'buyer',  # Using correct field name
            'phone_number': '+211987654321',  # Using correct field name
            'location': 'Juba',
        }
    )
    
    if created:
        buyer.set_password('password123')
        buyer.save()
        print("✅ Created buyer user: buyer1")
    else:
        print("✅ Buyer user already exists")
    
    # Create an equipment seller user
    equipment_seller, created = User.objects.get_or_create(
        username='equipment1',
        defaults={
            'email': 'equipment1@example.com',
            'first_name': 'Michael',
            'last_name': 'Equipment',
            'is_active': True,
            'user_type': 'equipment_seller',  # Using correct field name
            'phone_number': '+211555555555',  # Using correct field name
            'location': 'Wau',
        }
    )
    
    if created:
        equipment_seller.set_password('password123')
        equipment_seller.save()
        print("✅ Created equipment seller user: equipment1")
    else:
        print("✅ Equipment seller user already exists")
    
    # Create a transporter user
    transporter, created = User.objects.get_or_create(
        username='transporter1',
        defaults={
            'email': 'transporter1@example.com',
            'first_name': 'David',
            'last_name': 'Transporter',
            'is_active': True,
            'user_type': 'transporter',  # Using correct field name
            'phone_number': '+211444444444',  # Using correct field name
            'location': 'Yei',
        }
    )
    
    if created:
        transporter.set_password('password123')
        transporter.save()
        print("✅ Created transporter user: transporter1")
    else:
        print("✅ Transporter user already exists")
    
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
            'user_type': 'farmer',  # Default user type
            'phone_number': '+211999999999',
            'location': 'Juba',
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
                'harvest_date': date.today() - timedelta(days=2),
                'is_available': True
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
    print("Admin - Username: admin, Password: admin123")
    print("\nYou can now:")
    print("1. Login to test the dashboards")
    print("2. Access Django admin at http://127.0.0.1:8000/admin/")
    print("3. Test API endpoints")

if __name__ == '__main__':
    create_sample_data()
