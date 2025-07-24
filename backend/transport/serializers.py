from rest_framework import serializers
from .models import Transport, TransportRequest

class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = ['id', 'vehicle_name', 'description', 'image', 'available', 'price_per_trip', 'created_at', 'owner']
        read_only_fields = ['id', 'created_at', 'owner']

class TransportRequestSerializer(serializers.ModelSerializer):
    transport_vehicle_name = serializers.CharField(source='transport.vehicle_name', read_only=True)
    transport_image = serializers.ImageField(source='transport.image', read_only=True)
    transport_price_per_trip = serializers.DecimalField(source='transport.price_per_trip', max_digits=10, decimal_places=2, read_only=True)
    payment_method = serializers.CharField(read_only=True)
    
    class Meta:
        model = TransportRequest
        fields = ['id', 'transport', 'transport_vehicle_name', 'transport_image', 'transport_price_per_trip', 'farmer', 'pickup_location', 'delivery_location', 
                 'cargo_details', 'status', 'message', 'payment_method', 'created_at', 'updated_at']
        read_only_fields = ['id', 'transport_vehicle_name', 'transport_image', 'transport_price_per_trip', 'farmer', 'created_at', 'updated_at']
