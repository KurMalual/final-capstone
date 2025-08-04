from rest_framework import serializers
from .models import Equipment, EquipmentRentalRequest

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'image', 'available', 'price_per_day', 'created_at', 'owner', 'terms_and_conditions']
        read_only_fields = ['id', 'created_at', 'owner']

class EquipmentRentalRequestSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    equipment_image = serializers.ImageField(source='equipment.image', read_only=True)
    equipment_price_per_day = serializers.DecimalField(source='equipment.price_per_day', max_digits=10, decimal_places=2, read_only=True)
    payment_method = serializers.CharField(read_only=True)
    agreed_to_terms = serializers.BooleanField(write_only=True, required=True)
    
    class Meta:
        model = EquipmentRentalRequest
        fields = ['id', 'equipment', 'equipment_name', 'equipment_image', 'equipment_price_per_day', 'farmer', 'status', 'message', 'operation_location', 'payment_method', 'created_at', 'updated_at', 'agreed_to_terms']
        read_only_fields = ['id', 'equipment_name', 'equipment_image', 'equipment_price_per_day', 'farmer', 'created_at', 'updated_at']

    def validate_agreed_to_terms(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the terms and conditions to proceed.")
        return value

    def create(self, validated_data):
        # Remove 'agreed_to_terms' from validated_data
        validated_data.pop('agreed_to_terms', None)
        return super().create(validated_data)
