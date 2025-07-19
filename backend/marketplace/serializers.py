from rest_framework import serializers
from .models import Product, ProductOrder

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'image', 'price', 'quantity', 'category', 'available', 'created_at', 'farmer']
        read_only_fields = ['id', 'created_at', 'farmer']

class ProductOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = ProductOrder
        fields = ['id', 'product', 'product_name', 'buyer', 'quantity', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'product_name', 'buyer', 'created_at', 'updated_at']
