from rest_framework import serializers
from .models import Equipment, EquipmentRentalRequest

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'image', 'available', 'price_per_day', 'created_at', 'owner']
        read_only_fields = ['id', 'created_at', 'owner']

class EquipmentRentalRequestSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    equipment_image = serializers.ImageField(source='equipment.image', read_only=True)
    equipment_price_per_day = serializers.DecimalField(source='equipment.price_per_day', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = EquipmentRentalRequest
        fields = ['id', 'equipment', 'equipment_name', 'equipment_image', 'equipment_price_per_day', 'farmer', 'status', 'message', 'operation_location', 'created_at', 'updated_at']
        read_only_fields = ['id', 'equipment_name', 'equipment_image', 'equipment_price_per_day', 'farmer', 'created_at', 'updated_at']
