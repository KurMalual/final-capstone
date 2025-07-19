from django.db import models
from django.conf import settings

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_equipment')
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class EquipmentRentalRequest(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='rental_requests')
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='equipment_rental_requests')
    status = models.CharField(max_length=20, choices=[('pending','Pending'),('approved','Approved'),('rejected','Rejected')], default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_equipment')
    available = models.BooleanField(default=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class EquipmentRentalRequest(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='rental_requests')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_rental_requests')
    status = models.CharField(max_length=20, choices=[('pending','Pending'),('approved','Approved'),('rejected','Rejected')], default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
