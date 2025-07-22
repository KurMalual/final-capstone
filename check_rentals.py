#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from equipment.models import EquipmentRentalRequest

def check_rental_requests():
    print("=== Equipment Rental Requests ===")
    requests = EquipmentRentalRequest.objects.all().select_related('equipment', 'farmer')
    
    if not requests.exists():
        print("No rental requests found in database.")
        return
    
    for request in requests:
        print(f"ID: {request.id}")
        print(f"Equipment: {request.equipment.name}")
        print(f"Operation Location: {request.operation_location}")
        print(f"Status: {request.status}")
        print(f"Message: {request.message}")
        print(f"Farmer: {request.farmer.username}")
        print(f"Created: {request.created_at}")
        print("-" * 40)

if __name__ == "__main__":
    check_rental_requests()
