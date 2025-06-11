from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Equipment, EquipmentRental
from .serializers import EquipmentSerializer, EquipmentRentalSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access to equipment
    
    def get_queryset(self):
        queryset = Equipment.objects.all()
        equipment_type = self.request.query_params.get('type')
        if equipment_type:
            queryset = queryset.filter(equipment_type=equipment_type)
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        # Check if user is authenticated for creating equipment
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Set the owner to the current user
        data = request.data.copy()
        data['owner'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def my_equipment(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        equipment = Equipment.objects.filter(owner=request.user)
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)


class EquipmentRentalViewSet(viewsets.ModelViewSet):
    queryset = EquipmentRental.objects.all()
    serializer_class = EquipmentRentalSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access for viewing
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return EquipmentRental.objects.none()
        
        user = self.request.user
        if user.user_type == 'equipment_seller':
            return EquipmentRental.objects.filter(equipment__owner=user)
        else:
            return EquipmentRental.objects.filter(renter=user)
    
    def create(self, request, *args, **kwargs):
        # Check if user is authenticated for creating rentals
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Set the renter to the current user
        data = request.data.copy()
        data['renter'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def my_rentals(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        rentals = EquipmentRental.objects.filter(renter=request.user)
        serializer = self.get_serializer(rentals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def rental_requests(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # For equipment owners to see rental requests for their equipment
        requests = EquipmentRental.objects.filter(equipment__owner=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
