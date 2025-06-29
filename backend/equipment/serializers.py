from rest_framework import serializers
from .models import Equipment, EquipmentRental
from users.serializers import UserSerializer


class EquipmentSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    
    class Meta:
        model = Equipment
        fields = '__all__'
        read_only_fields = ('owner',)  # Make owner read-only so it's set automatically
    
    def create(self, validated_data):
        # The owner will be set in the view, so we don't need to handle it here
        return super().create(validated_data)


class EquipmentRentalSerializer(serializers.ModelSerializer):
    equipment_details = EquipmentSerializer(source='equipment', read_only=True)
    renter_details = UserSerializer(source='renter', read_only=True)
    
    class Meta:
        model = EquipmentRental
        fields = '__all__'
