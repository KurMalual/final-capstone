from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'my_products']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)
    
    def get_queryset(self):
        queryset = Product.objects.all()
        if self.action == 'my_products':
            return queryset.filter(farmer=self.request.user)
            
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
            
        # Only show available products in the main list
        if self.action == 'list':
            queryset = queryset.filter(is_available=True)
            
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        products = self.get_queryset()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'farmer':
            return Order.objects.filter(product__farmer=user)
        elif user.user_type == 'buyer':
            return Order.objects.filter(buyer=user)
        return Order.objects.none()
    
    def perform_create(self, serializer):
        product = get_object_or_404(Product, id=self.request.data.get('product'))
        quantity = int(self.request.data.get('quantity', 1))
        total_price = product.price * quantity
        serializer.save(
            buyer=self.request.user,
            product=product,
            total_price=total_price
        )
