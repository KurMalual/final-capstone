from rest_framework import serializers
from .models import Equipment, EquipmentRentalRequest

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'image', 'available', 'price_per_day', 'created_at', 'owner']
        read_only_fields = ['id', 'created_at', 'owner']

class EquipmentRentalRequestSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    
    class Meta:
        model = EquipmentRentalRequest
        fields = ['id', 'equipment', 'equipment_name', 'farmer', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'equipment_name', 'farmer', 'created_at', 'updated_at']
