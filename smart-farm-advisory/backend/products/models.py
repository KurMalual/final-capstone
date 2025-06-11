from django.db import models
from users.models import User

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
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farmer_products')
    location = models.CharField(max_length=100)
    harvest_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_available = models.BooleanField(default=True)
    # Temporarily comment out image field until migration is applied
    # image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.username}"

    class Meta:
        ordering = ['-created_at']


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_orders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_orders')
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.buyer.username} - {self.product.name}"

    class Meta:
        ordering = ['-created_at']
