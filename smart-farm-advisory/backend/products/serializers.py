from rest_framework import serializers
from .models import Product, Order
from users.serializers import UserSerializer

class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description', 'price', 
            'quantity', 'unit', 'farmer', 'farmer_name', 
            'location', 'harvest_date', 'created_at', 'is_available'
        ]
        read_only_fields = ['farmer', 'farmer_name']
    
    def get_farmer_name(self, obj):
        return obj.farmer.get_full_name() if obj.farmer else None

class OrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'product', 'product_name',
            'quantity', 'total_price', 'status', 'delivery_address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['buyer', 'buyer_name', 'product_name', 'total_price']
    
    def get_buyer_name(self, obj):
        return obj.buyer.get_full_name() if obj.buyer else None
    
    def get_product_name(self, obj):
        return obj.product.name if obj.product else None
