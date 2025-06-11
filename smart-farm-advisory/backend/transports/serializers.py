from rest_framework import serializers
from .models import TransportationRequest, Vehicle
from users.serializers import UserSerializer


class VehicleSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = '__all__'


class TransportationRequestSerializer(serializers.ModelSerializer):
    requester_details = UserSerializer(source='requester', read_only=True)
    transporter_details = UserSerializer(source='transporter', read_only=True)
    
    class Meta:
        model = TransportationRequest
        fields = '__all__'
