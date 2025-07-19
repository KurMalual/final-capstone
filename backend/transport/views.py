from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import Transport, TransportRequest
from .serializers import TransportSerializer, TransportRequestSerializer




class TransportViewSet(viewsets.ModelViewSet):
    queryset = Transport.objects.all()
    serializer_class = TransportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = Transport.objects.all()
        # Transporters see their own, farmers see all available
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'transporter':
                return queryset.filter(owner=user)
            elif hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(available=True)
        return queryset.filter(available=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)



class TransportRequestViewSet(viewsets.ModelViewSet):
    queryset = TransportRequest.objects.all()
    serializer_class = TransportRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = TransportRequest.objects.all()
        # Farmers see their own requests, transporters see requests for their vehicles
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(farmer=user)
            elif hasattr(user, 'role') and user.role == 'transporter':
                return queryset.filter(transport__owner=user)
        return queryset.none()

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({'detail': 'Transport request already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        rental.status = 'approved'
        rental.save()
        # Send email notification to farmer if farmer exists and has email
        if rental.farmer and rental.farmer.email:
            send_mail(
                'Transport Request Approved',
                f'Your transport request for {rental.transport.vehicle_name} has been approved by the owner.',
                'noreply@smartfarm.com',
                [rental.farmer.email],
                fail_silently=True,
            )
        return Response({'detail': 'Transport request approved and farmer notified.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({'detail': 'Transport request already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        rental.status = 'rejected'
        rental.save()
        # Send email notification to farmer if farmer exists and has email
        if rental.farmer and rental.farmer.email:
            send_mail(
                'Transport Request Rejected',
                f'Your transport request for {rental.transport.vehicle_name} has been rejected by the owner.',
                'noreply@smartfarm.com',
                [rental.farmer.email],
                fail_silently=True,
            )
        return Response({'detail': 'Transport request rejected and farmer notified.'}, status=status.HTTP_200_OK)
