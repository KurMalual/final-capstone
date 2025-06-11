from rest_framework import serializers
from .models import Equipment, EquipmentRental
from users.serializers import UserSerializer


class EquipmentSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    
    class Meta:
        model = Equipment
        fields = '__all__'


class EquipmentRentalSerializer(serializers.ModelSerializer):
    equipment_details = EquipmentSerializer(source='equipment', read_only=True)
    renter_details = UserSerializer(source='renter', read_only=True)
    
    class Meta:
        model = EquipmentRental
        fields = '__all__'
