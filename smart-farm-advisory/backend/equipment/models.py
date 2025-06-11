from django.db import models
from users.models import User


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
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_owned')
    location = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.owner.username}"


class EquipmentRental(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='equipment_rentals')
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_rented')
    start_date = models.DateField()
    end_date = models.DateField()
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.equipment.name} - {self.renter.username}"
