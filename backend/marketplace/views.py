from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import Product, ProductOrder
from .serializers import ProductSerializer, ProductOrderSerializer




class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = Product.objects.all()
        # Farmers see their own products, buyers see all available
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(farmer=user)
            elif hasattr(user, 'role') and user.role == 'buyer':
                return queryset.filter(available=True)
        return queryset.filter(available=True)

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)



class ProductOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductOrder.objects.all()
    serializer_class = ProductOrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = ProductOrder.objects.all()
        # Buyers see their own orders, farmers see orders for their products
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'buyer':
                return queryset.filter(buyer=user)
            elif hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(product__farmer=user)
        return queryset.none()

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        order = self.get_object()
        if order.status != 'pending':
            return Response({'detail': 'Order already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'approved'
        order.save()
        # Send email notification to buyer
        if order.buyer.email:
            send_mail(
                'Order Approved',
                f'Your order for {order.product.name} has been approved by the farmer.',
                'noreply@smartfarm.com',
                [order.buyer.email],
                fail_silently=True,
            )
        return Response({'detail': 'Order approved and buyer notified.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        order = self.get_object()
        if order.status != 'pending':
            return Response({'detail': 'Order already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'rejected'
        order.save()
        # Send email notification to buyer
        if order.buyer.email:
            send_mail(
                'Order Rejected',
                f'Your order for {order.product.name} has been rejected by the farmer.',
                'noreply@smartfarm.com',
                [order.buyer.email],
                fail_silently=True,
            )
        return Response({'detail': 'Order rejected and buyer notified.'}, status=status.HTTP_200_OK)
