from django.db import models
from users.models import User


class TransportationRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transport_requests_made')
    pickup_location = models.CharField(max_length=100)
    delivery_location = models.CharField(max_length=100)
    cargo_description = models.TextField()
    weight = models.DecimalField(max_digits=8, decimal_places=2)  # in kg
    pickup_date = models.DateTimeField()
    budget = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='transport_jobs_taken')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transport from {self.pickup_location} to {self.delivery_location}"


class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('truck', 'Truck'),
        ('van', 'Van'),
        ('pickup', 'Pickup'),
        ('refrigerated', 'Refrigerated Vehicle'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    capacity = models.DecimalField(max_digits=8, decimal_places=2)  # in kg
    rate_per_km = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.type}"
