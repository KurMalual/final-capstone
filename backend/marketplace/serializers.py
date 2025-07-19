from rest_framework import serializers
from .models import Product, ProductOrder

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'image', 'price', 'quantity', 'category', 'available', 'created_at', 'farmer']
        read_only_fields = ['id', 'created_at', 'farmer']

class ProductOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOrder
        fields = ['id', 'product', 'buyer', 'quantity', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'buyer', 'created_at', 'updated_at']
