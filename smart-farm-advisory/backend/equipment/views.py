from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import logging

from .models import Equipment, EquipmentRental
from .serializers import EquipmentSerializer, EquipmentRentalSerializer

logger = logging.getLogger(__name__)

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
        
        # Log the incoming data
        logger.info(f"Equipment creation request from {request.user.username}")
        logger.info(f"Request data: {request.data}")
        
        # Set the owner to the current user
        data = request.data.copy()
        
        # Validate required fields
        required_fields = ['name', 'equipment_type', 'daily_rate', 'location', 'description']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return Response({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate daily_rate is a valid number
        try:
            float(data.get('daily_rate', 0))
        except (ValueError, TypeError):
            return Response({
                'error': 'Daily rate must be a valid number'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
        
        try:
            serializer.is_valid(raise_exception=True)
            equipment = serializer.save(owner=request.user)
            
            logger.info(f"Equipment created successfully: {equipment.name} (ID: {equipment.id})")
            
            headers = self.get_success_headers(serializer.data)
            return Response({
                'success': True,
                'message': 'Equipment added successfully!',
                'equipment': serializer.data
            }, status=status.HTTP_201_CREATED, headers=headers)
        
        except Exception as e:
            logger.error(f"Equipment creation failed: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
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

    @action(detail=False, methods=['get'])
    def active_rentals(self, request):
        """Get active rentals for the current user"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Get active rentals where user is either renter or equipment owner
            if request.user.user_type == 'equipment_seller':
                rentals = EquipmentRental.objects.filter(
                    equipment__owner=request.user,
                    status='active'
                )
            else:
                rentals = EquipmentRental.objects.filter(
                    renter=request.user,
                    status='active'
                )
        
            serializer = self.get_serializer(rentals, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching active rentals: {str(e)}")
            return Response({
                'error': 'Failed to fetch active rentals',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EquipmentListCreateView(generics.ListCreateAPIView):
    """List all equipment or create new equipment"""
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            equipment = serializer.save(owner=self.request.user)
            logger.info(f"Equipment '{equipment.name}' created successfully by {self.request.user.username}")
            return equipment
        except Exception as e:
            logger.error(f"Error creating equipment: {str(e)}")
            raise

class MyEquipmentView(APIView):
    """Get equipment owned by current user"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            equipment = Equipment.objects.filter(owner=request.user)
            serializer = EquipmentSerializer(equipment, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching user equipment: {str(e)}")
            return Response(
                {'error': 'Failed to fetch equipment'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RentalRequestsView(APIView):
    """Handle equipment rental requests"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # For now, return empty list - can be expanded later
        return Response([])

class ActiveRentalsView(APIView):
    """Handle active equipment rentals"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # For now, return empty list - can be expanded later
        return Response([])

class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete equipment"""
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only access their own equipment
        return Equipment.objects.filter(owner=self.request.user)

class RentEquipmentView(APIView):
    """Rent equipment"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            equipment = get_object_or_404(Equipment, pk=pk)
            # Add rental logic here
            return Response({
                'success': True,
                'message': f'Equipment {equipment.name} rented successfully'
            })
        except Exception as e:
            logger.error(f"Error renting equipment: {str(e)}")
            return Response(
                {'error': 'Failed to rent equipment'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Legacy function-based views for backward compatibility
@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def equipment_list_create(request):
    """Legacy equipment list/create view"""
    if request.method == 'GET':
        equipment = Equipment.objects.all()
        serializer = EquipmentSerializer(equipment, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        try:
            data = request.data
            logger.info(f"Creating equipment with data: {data}")
            
            # Validate required fields
            required_fields = ['name', 'equipment_type', 'daily_rate', 'location']
            for field in required_fields:
                if not data.get(field):
                    return Response({
                        'success': False,
                        'error': f'{field} is required'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create equipment
            equipment = Equipment.objects.create(
                name=data['name'],
                equipment_type=data['equipment_type'],
                daily_rate=data['daily_rate'],
                location=data['location'],
                description=data.get('description', ''),
                owner=request.user
            )
            
            logger.info(f"Equipment created successfully: {equipment.name}")
            
            serializer = EquipmentSerializer(equipment)
            return Response({
                'success': True,
                'equipment': serializer.data,
                'message': 'Equipment added successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating equipment: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to create equipment'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
