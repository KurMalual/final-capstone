from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='equipment/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_equipment')
    available = models.BooleanField(default=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class EquipmentRentalRequest(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='rental_requests')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_rental_requests')
    operation_location = models.CharField(max_length=200, help_text="Location where the equipment will be used")
    status = models.CharField(max_length=20, choices=[('pending','Pending'),('approved','Approved'),('rejected','Rejected')], default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50, default='Cash on Delivery')
