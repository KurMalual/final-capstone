from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import TransportationRequest, Vehicle
from .serializers import TransportationRequestSerializer, VehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            # Show all available vehicles for browsing
            return Vehicle.objects.filter(is_available=True)
        else:
            # For other actions, show only user's vehicles
            return Vehicle.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_vehicles(self, request):
        vehicles = Vehicle.objects.filter(owner=request.user)
        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data)


class TransportationRequestViewSet(viewsets.ModelViewSet):
    queryset = TransportationRequest.objects.all()
    serializer_class = TransportationRequestSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access for viewing
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return TransportationRequest.objects.filter(status='pending')  # Show pending requests to public
        
        user = self.request.user
        if user.user_type == 'transporter':
            return TransportationRequest.objects.filter(status='pending')
        else:
            return TransportationRequest.objects.filter(requester=user)
    
    def create(self, request, *args, **kwargs):
        # Check if user is authenticated for creating requests
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Set the requester to the current user
        data = request.data.copy()
        data['requester'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        requests = TransportationRequest.objects.filter(requester=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available_jobs(self, request):
        # Show available transport jobs (pending requests)
        jobs = TransportationRequest.objects.filter(status='pending')
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.user_type != 'transporter':
            return Response({'error': 'Only transporters can accept jobs'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            transport_request = get_object_or_404(TransportationRequest, pk=pk, status='pending')
            transport_request.status = 'accepted'
            transport_request.transporter = request.user
            transport_request.save()
            
            serializer = self.get_serializer(transport_request)
            return Response({
                'message': 'Transport request accepted successfully',
                'data': serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.user_type != 'transporter':
            return Response({'error': 'Only transporters can reject jobs'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            transport_request = get_object_or_404(TransportationRequest, pk=pk, status='pending')
            transport_request.status = 'cancelled'
            transport_request.save()
            
            return Response({'message': 'Transport request rejected successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
