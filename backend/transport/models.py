from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Transport(models.Model):
    vehicle_name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_transports')  # unique related_name
    available = models.BooleanField(default=True)
    price_per_trip = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(
        max_length=50,
        choices=[('cash', 'Cash'), ('credit', 'Credit'), ('mobile', 'Mobile Money')],
        default='cash',
        help_text='Preferred payment method for transport services.'
    )
    terms_and_conditions = models.TextField(
        default='Vehicles should be used responsibly. Any damage caused by the farmer will result in a penalty. Vehicles are rented for a maximum of one week.',
        help_text='Terms and conditions for using this transport service.'
    )

class TransportRequest(models.Model):
    transport = models.ForeignKey(Transport, on_delete=models.CASCADE, related_name='transport_requests')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transport_requests', null=True, blank=True)
    pickup_location = models.CharField(max_length=200, blank=True)
    delivery_location = models.CharField(max_length=200, blank=True)
    cargo_details = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('pending','Pending'),('approved','Approved'),('rejected','Rejected')], default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50, default='Cash on Delivery')
