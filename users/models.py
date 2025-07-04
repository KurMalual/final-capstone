from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('transporter', 'Transporter'),
        ('equipment_seller', 'Equipment Seller'),
    ]
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='farmer')
    phone_number = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('grains', 'Grains'),
        ('livestock', 'Livestock'),
        ('dairy', 'Dairy'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=20)  # kg, tons, pieces, etc.
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    location = models.CharField(max_length=100)
    harvest_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.username}"


class Equipment(models.Model):
    EQUIPMENT_TYPE_CHOICES = [
        ('tractor', 'Tractor'),
        ('harvester', 'Harvester'),
        ('planter', 'Planter'),
        ('sprayer', 'Sprayer'),
        ('irrigation', 'Irrigation Equipment'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    equipment_type = models.CharField(max_length=20, choices=EQUIPMENT_TYPE_CHOICES)
    description = models.TextField()
    daily_rate = models.DecimalField(max_digits=8, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment')
    location = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.owner.username}"


class TransportationRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transport_requests')
    pickup_location = models.CharField(max_length=100)
    delivery_location = models.CharField(max_length=100)
    cargo_description = models.TextField()
    weight = models.DecimalField(max_digits=8, decimal_places=2)  # in kg
    pickup_date = models.DateTimeField()
    budget = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='transport_jobs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transport from {self.pickup_location} to {self.delivery_location}"
