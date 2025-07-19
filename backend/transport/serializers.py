from rest_framework import serializers
from .models import Transport, TransportRequest

class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = ['id', 'vehicle_name', 'description', 'image', 'available', 'price_per_trip', 'created_at', 'owner']
        read_only_fields = ['id', 'created_at', 'owner']

class TransportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportRequest
        fields = ['id', 'transport', 'farmer', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'farmer', 'created_at', 'updated_at']
