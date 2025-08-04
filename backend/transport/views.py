from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import Transport, TransportRequest
from .serializers import TransportSerializer, TransportRequestSerializer
from rest_framework import serializers




class TransportViewSet(viewsets.ModelViewSet):
    queryset = Transport.objects.all()
    serializer_class = TransportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = Transport.objects.all()
        # Transporters see ALL their own vehicles (available and unavailable), 
        # farmers see only available vehicles
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'transporter':
                return queryset.filter(owner=user)
            elif hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(available=True)
        return queryset.filter(available=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='toggle-availability')
    def toggle_availability(self, request, pk=None):
        transport = self.get_object()
        transport.available = not transport.available
        transport.save()
        status_text = "available" if transport.available else "unavailable"
        return Response({'detail': f'Transport marked as {status_text}.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def terms_and_conditions(self, request, pk=None):
        transport = self.get_object()
        return Response({'terms_and_conditions': transport.terms_and_conditions})




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
        if not serializer.validated_data.get('agreed_to_terms', False):
            raise serializers.ValidationError("You must agree to the terms and conditions to proceed.")
        # Save the transport request
        transport_request = serializer.save(farmer=self.request.user)
        # Mark the transport as unavailable
        transport_request.transport.available = False
        transport_request.transport.save()

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({'detail': 'Transport request already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        rental.status = 'approved'
        rental.save()
        # Keep transport unavailable when approved (it's being used)
        rental.transport.available = False
        rental.transport.save()
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
        # Make transport available again when rejected
        rental.transport.available = True
        rental.transport.save()
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

    @action(detail=True, methods=['post'], url_path='approve-request')
    def approve_request(self, request, pk=None):
        transport_request = self.get_object()
        transport_request.status = 'approved'
        transport_request.payment_method = 'Cash on Delivery'
        transport_request.save()
        return Response({'detail': 'Transport request approved with payment method Cash on Delivery.'}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        # Make transport available again when request is deleted
        instance.transport.available = True
        instance.transport.save()
        # Delete the transport request
        instance.delete()
        return Response({'detail': 'Transport request rejected and farmer notified.'}, status=status.HTTP_200_OK)
