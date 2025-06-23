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
from products.models import Product, Order
from equipment.models import Equipment, EquipmentRental
from transports.models import TransportJob, Vehicle
import requests

User = get_user_model()

def test_system_status():
    print("🔍 Smart Farm Advisory - System Status Check")
    print("=" * 60)
    
    # 1. Check users
    print("1. 👥 User Status:")
    users = User.objects.all()
    for user in users:
        print(f"   ✅ {user.username} ({user.user_type}) - {user.email}")
    
    # 2. Check products
    print(f"\n2. 📦 Products: {Product.objects.count()} total")
    for product in Product.objects.all()[:3]:
        print(f"   📦 {product.name} - ${product.price} by {product.farmer.username}")
    
    # 3. Check equipment
    print(f"\n3. 🚜 Equipment: {Equipment.objects.count()} total")
    for equipment in Equipment.objects.all()[:3]:
        print(f"   🚜 {equipment.name} - ${equipment.daily_rate}/day by {equipment.owner.username}")
    
    # 4. Check transport jobs
    print(f"\n4. 🚛 Transport Jobs: {TransportJob.objects.count()} total")
    for job in TransportJob.objects.all()[:3]:
        print(f"   🚛 {job.pickup_location} → {job.delivery_location} - ${job.price}")
    
    # 5. Test API endpoints
    print(f"\n5. 🌐 API Endpoints Test:")
    base_url = "http://127.0.0.1:8000/api"
    
    endpoints = [
        "/products/",
        "/equipment/",
        "/transports/available_jobs/",
        "/auth/profile/",
        "/weather/data/current/?location=Juba"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=3)
            status = "✅" if response.status_code == 200 else "⚠️"
            print(f"   {status} {endpoint} - {response.status_code}")
        except Exception as e:
            print(f"   ❌ {endpoint} - Error: {str(e)[:30]}...")
    
    print("\n" + "=" * 60)
    print("🎉 System Status Check Complete!")
    print("\n📋 Summary:")
    print(f"   👥 Users: {User.objects.count()}")
    print(f"   📦 Products: {Product.objects.count()}")
    print(f"   🚜 Equipment: {Equipment.objects.count()}")
    print(f"   🚛 Transport Jobs: {TransportJob.objects.count()}")
    print(f"   📝 Orders: {Order.objects.count()}")
    
    print("\n🚀 Ready to use!")
    print("   Frontend: http://localhost:3000")
    print("   Backend API: http://localhost:8000/api")
    print("   Admin Panel: http://localhost:8000/admin")

if __name__ == "__main__":
    test_system_status()
