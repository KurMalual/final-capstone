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
        # Farmers see ALL their own products (available and unavailable), 
        # buyers see only available products
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'farmer':
                return queryset.filter(farmer=user)
            elif hasattr(user, 'role') and user.role == 'buyer':
                return queryset.filter(available=True)
        return queryset.filter(available=True)

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    @action(detail=True, methods=['post'], url_path='toggle-availability')
    def toggle_availability(self, request, pk=None):
        product = self.get_object()
        product.available = not product.available
        product.save()
        status_text = "available" if product.available else "unavailable"
        return Response({'detail': f'Product marked as {status_text}.'}, status=status.HTTP_200_OK)



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
        # Save the product order
        product_order = serializer.save(buyer=self.request.user)
        # Mark the product as unavailable
        product_order.product.available = False
        product_order.product.save()

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        order = self.get_object()
        if order.status != 'pending':
            return Response({'detail': 'Order already processed.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'approved'
        order.save()
        # Keep product unavailable when approved (it's been sold)
        order.product.available = False
        order.product.save()
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
        # Make product available again when rejected
        order.product.available = True
        order.product.save()
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

    def perform_destroy(self, instance):
        # Make product available again when order is deleted
        instance.product.available = True
        instance.product.save()
        # Delete the product order
        instance.delete()
        return Response({'detail': 'Order rejected and buyer notified.'}, status=status.HTTP_200_OK)
