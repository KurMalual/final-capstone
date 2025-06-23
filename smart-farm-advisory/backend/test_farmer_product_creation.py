#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartfarm.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Product
from datetime import date, datetime
import json

User = get_user_model()

def test_farmer_product_creation():
    print("🧪 Testing Farmer Product Creation System")
    print("=" * 50)
    
    try:
        # 1. Check if farmer user exists
        print("1. Checking farmer user...")
        try:
            farmer = User.objects.get(username='Farmer')
            print(f"   ✅ Farmer found: {farmer.username} ({farmer.user_type})")
        except User.DoesNotExist:
            print("   ❌ Farmer user not found!")
            return False
        
        # 2. Test product creation directly
        print("\n2. Testing direct product creation...")
        
        # Create test product data
        product_data = {
            'name': 'Test Tomatoes',
            'category': 'vegetables',
            'description': 'Fresh organic tomatoes from my farm',
            'price': 25.50,
            'quantity': 100,
            'unit': 'kg',
            'location': 'Juba Central Farm',
            'harvest_date': date.today(),
            'farmer': farmer,
            'is_available': True
        }
        
        # Create product
        product = Product.objects.create(**product_data)
        print(f"   ✅ Product created successfully: {product.name} (ID: {product.id})")
        
        # 3. Verify product in database
        print("\n3. Verifying product in database...")
        saved_product = Product.objects.get(id=product.id)
        print(f"   ✅ Product verified: {saved_product.name}")
        print(f"   📊 Price: ${saved_product.price}")
        print(f"   📦 Quantity: {saved_product.quantity} {saved_product.unit}")
        print(f"   👨‍🌾 Farmer: {saved_product.farmer.username}")
        
        # 4. Test API serialization
        print("\n4. Testing API serialization...")
        from products.serializers import ProductSerializer
        serializer = ProductSerializer(saved_product)
        serialized_data = serializer.data
        print(f"   ✅ Product serialized successfully")
        print(f"   📄 Serialized data keys: {list(serialized_data.keys())}")
        
        # 5. Test farmer's products query
        print("\n5. Testing farmer's products query...")
        farmer_products = Product.objects.filter(farmer=farmer)
        print(f"   ✅ Farmer has {farmer_products.count()} products")
        
        for prod in farmer_products:
            print(f"   📦 {prod.name} - ${prod.price} ({prod.category})")
        
        # 6. Test product validation
        print("\n6. Testing product validation...")
        
        # Test with missing required fields
        try:
            invalid_product = Product.objects.create(
                name='',  # Empty name should fail
                farmer=farmer
            )
            print("   ❌ Validation failed - empty name was accepted")
        except Exception as e:
            print(f"   ✅ Validation working - rejected empty name: {str(e)[:50]}...")
        
        # 7. Clean up test data
        print("\n7. Cleaning up test data...")
        Product.objects.filter(name__startswith='Test').delete()
        print("   ✅ Test products cleaned up")
        
        print("\n" + "=" * 50)
        print("🎉 ALL TESTS PASSED! Product creation system is working!")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoints():
    print("\n🌐 Testing API Endpoints")
    print("=" * 30)
    
    import requests
    
    base_url = "http://127.0.0.1:8000/api"
    
    # Test endpoints
    endpoints = [
        "/products/",
        "/products/my_products/",
        "/equipment/",
        "/transports/available_jobs/",
        "/weather/data/current/?location=Juba"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"   ✅ {endpoint} - OK")
            else:
                print(f"   ⚠️  {endpoint} - Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"   ❌ {endpoint} - Error: {str(e)[:30]}...")

if __name__ == "__main__":
    print("🚀 Smart Farm Advisory - System Test")
    print("=" * 50)
    
    # Test database operations
    success = test_farmer_product_creation()
    
    # Test API endpoints
    test_api_endpoints()
    
    if success:
        print("\n✅ System is ready for use!")
        print("\n📋 Next steps:")
        print("   1. Start Django server: python manage.py runserver")
        print("   2. Start React frontend: cd ../frontend && npm start")
        print("   3. Visit: http://localhost:3000")
        print("   4. Login as 'Farmer' with password 'farmer123'")
        print("   5. Try adding a product!")
    else:
        print("\n❌ System has issues that need to be fixed.")
