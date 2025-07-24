from rest_framework import serializers
from .models import Product, ProductOrder

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'image', 'price', 'quantity', 'category', 'available', 'created_at', 'farmer']
        read_only_fields = ['id', 'created_at', 'farmer']

class ProductOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()
    payment_method = serializers.CharField(read_only=True)
    
    class Meta:
        model = ProductOrder
        fields = ['id', 'product', 'product_name', 'product_image', 'product_price', 'total_price', 'buyer', 'quantity', 'status', 'message', 'payment_method', 'created_at', 'updated_at']
        read_only_fields = ['id', 'product_name', 'product_image', 'product_price', 'total_price', 'buyer', 'created_at', 'updated_at']
    
    def get_total_price(self, obj):
        return obj.product.price * obj.quantity
