from rest_framework import serializers
from .models import Equipment, EquipmentRentalRequest

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'available', 'price_per_day', 'created_at', 'owner']
        read_only_fields = ['id', 'created_at', 'owner']

class EquipmentRentalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentRentalRequest
        fields = ['id', 'equipment', 'farmer', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'farmer', 'created_at', 'updated_at']
