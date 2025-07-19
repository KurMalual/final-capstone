from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('equipment_seller', 'Equipment Seller'),
        ('transporter', 'Transporter'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')
