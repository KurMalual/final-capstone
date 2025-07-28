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
    preferred_payment_method = models.CharField(
        max_length=50,
        choices=[('cash', 'Cash'), ('credit', 'Credit'), ('mobile', 'Mobile Money')],
        default='cash',
        help_text='Preferred payment method for transactions.'
    )

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=255)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} - {self.subject}"
