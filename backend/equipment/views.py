from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import Equipment, EquipmentRentalRequest
from .serializers import EquipmentSerializer, EquipmentRentalRequestSerializer




class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = Equipment.objects.all()
        # Equipment sellers see their own, farmers see all available
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'equipment_seller':
                return queryset.filter(owner=user)
            elif hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(available=True)
        return queryset.filter(available=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)



class EquipmentRentalRequestViewSet(viewsets.ModelViewSet):
    queryset = EquipmentRentalRequest.objects.all()
    serializer_class = EquipmentRentalRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = EquipmentRentalRequest.objects.all()
        # Farmers see their own requests, sellers see requests for their equipment
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(farmer=user)
            elif hasattr(user, 'role') and user.role == 'equipment_seller':
                return queryset.filter(equipment__owner=user)
        return queryset.none()

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({'detail': 'Rental request already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        rental.status = 'approved'
        rental.save()
        # Send email notification to farmer
        if rental.farmer.email:
            send_mail(
                'Equipment Rental Approved',
                f'Your rental request for {rental.equipment.name} has been approved by the owner.',
                'noreply@smartfarm.com',
                [rental.farmer.email],
                fail_silently=True,
            )
        return Response({'detail': 'Rental request approved and farmer notified.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        rental = self.get_object()
        if rental.status != 'pending':
            return Response({'detail': 'Rental request already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        rental.status = 'rejected'
        rental.save()
        # Send email notification to farmer
        if rental.farmer.email:
            send_mail(
                'Equipment Rental Rejected',
                f'Your rental request for {rental.equipment.name} has been rejected by the owner.',
                'noreply@smartfarm.com',
                [rental.farmer.email],
                fail_silently=True,
            )
        return Response({'detail': 'Rental request rejected and farmer notified.'}, status=status.HTTP_200_OK)
