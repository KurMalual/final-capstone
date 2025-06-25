from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
import json
import logging
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer

logger = logging.getLogger(__name__)
User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        # Allow read access to everyone, require authentication for write operations
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'my_products']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Product creation attempt by user: {request.user}")
            logger.info(f"User authenticated: {request.user.is_authenticated}")
            logger.info(f"Request data: {request.data}")
            
            # Check if user is authenticated
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required',
                    'message': 'Please log in to add products'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Prepare data for serializer
            data = request.data.copy()
            data['farmer'] = request.user.id
            
            # Enhanced validation with detailed error messages
            required_fields = {
                'name': 'Product name',
                'description': 'Product description', 
                'price': 'Price',
                'quantity': 'Quantity',
                'location': 'Location',
                'harvest_date': 'Harvest date'
            }

            missing_fields = []
            invalid_fields = []

            for field, label in required_fields.items():
                value = data.get(field)
                if not value or str(value).strip() == '':
                    missing_fields.append(label)
                elif field == 'name' and len(str(value).strip()) < 2:
                    invalid_fields.append(f"{label} must be at least 2 characters")
                elif field == 'description' and len(str(value).strip()) < 5:
                    invalid_fields.append(f"{label} must be at least 5 characters")
                elif field == 'price':
                    try:
                        price_val = float(value)
                        if price_val <= 0:
                            invalid_fields.append(f"{label} must be greater than 0")
                    except (ValueError, TypeError):
                        invalid_fields.append(f"{label} must be a valid number")
                elif field == 'quantity':
                    try:
                        qty_val = int(value)
                        if qty_val <= 0:
                            invalid_fields.append(f"{label} must be greater than 0")
                    except (ValueError, TypeError):
                        invalid_fields.append(f"{label} must be a valid number")

            error_messages = []
            if missing_fields:
                error_messages.append(f"Missing required fields: {', '.join(missing_fields)}")
            if invalid_fields:
                error_messages.extend(invalid_fields)

            if error_messages:
                return Response({
                    'error': 'Validation failed',
                    'message': '; '.join(error_messages),
                    'details': error_messages
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                product = serializer.save(farmer=request.user)
                logger.info(f"Product created successfully: {product.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Product creation validation failed: {serializer.errors}")
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Product creation error: {str(e)}")
            return Response({
                'error': 'Failed to create product',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update(self, request, *args, **kwargs):
        try:
            logger.info(f"Product update attempt by user: {request.user}")
            logger.info(f"Product ID: {kwargs.get('pk')}")
            
            # Check if user is authenticated
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required',
                    'message': 'Please log in to update products'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            instance = self.get_object()
            
            # Check if user owns this product
            if instance.farmer != request.user:
                return Response({
                    'error': 'Permission denied',
                    'message': 'You can only edit your own products'
                }, status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            if serializer.is_valid():
                product = serializer.save()
                logger.info(f"Product updated successfully: {product.id}")
                return Response(serializer.data)
            else:
                logger.error(f"Product update validation failed: {serializer.errors}")
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Product update error: {str(e)}")
            return Response({
                'error': 'Failed to update product',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):
        try:
            logger.info(f"Product deletion attempt by user: {request.user}")
            logger.info(f"Product ID: {kwargs.get('pk')}")
            
            # Check if user is authenticated
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required',
                    'message': 'Please log in to delete products'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            instance = self.get_object()
            
            # Check if user owns this product
            if instance.farmer != request.user:
                return Response({
                    'error': 'Permission denied',
                    'message': 'You can only delete your own products'
                }, status=status.HTTP_403_FORBIDDEN)
            
            product_name = instance.name
            instance.delete()
            logger.info(f"Product deleted successfully: {product_name}")
            
            return Response({
                'message': f'Product "{product_name}" deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Product deletion error: {str(e)}")
            return Response({
                'error': 'Failed to delete product',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_queryset(self):
        queryset = Product.objects.all()
        if self.action == 'my_products':
            if self.request.user.is_authenticated:
                return queryset.filter(farmer=self.request.user)
            return Product.objects.none()
            
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
        try:
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required',
                    'message': 'Please log in to view your products'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
            products = self.get_queryset()
            serializer = self.get_serializer(products, many=True)
            logger.info(f"Retrieved {len(serializer.data)} products for user {request.user.username}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching user products: {str(e)}")
            return Response({
                'error': 'Failed to fetch products',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get orders for the current user (buyer perspective)"""
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'message': 'Please log in to view your orders'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            orders = Order.objects.filter(buyer=request.user)
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': 'Failed to fetch orders',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def received_orders(self, request):
        """Get orders received by farmer for their products"""
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'message': 'Please log in to view received orders'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            orders = Order.objects.filter(product__farmer=request.user)
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': 'Failed to fetch received orders',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductListCreateView(generics.ListCreateAPIView):
    """List all products or create new product"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)
        logger.info(f"Product created by {self.request.user.username}")

class MyProductsView(APIView):
    """Get products owned by current user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            products = Product.objects.filter(farmer=request.user)
            logger.info(f"Retrieved {products.count()} products for user {request.user.username}")
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching user products: {str(e)}")
            return Response(
                {'error': 'Failed to fetch products'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProductOrdersView(APIView):
    """Handle product orders"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # For now, return empty list - can be expanded later
        return Response([])

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete product"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only access their own products
        return Product.objects.filter(farmer=self.request.user)

class OrderProductView(APIView):
    """Order a product"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            product = get_object_or_404(Product, pk=pk)
            # Add order logic here
            return Response({
                'success': True,
                'message': f'Product {product.name} ordered successfully'
            })
        except Exception as e:
            logger.error(f"Error ordering product: {str(e)}")
            return Response(
                {'error': 'Failed to order product'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Legacy function-based views for backward compatibility
@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list_create(request):
    """Legacy product list/create view"""
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        try:
            data = request.data
            logger.info(f"Creating product with data: {data}")
            
            # Validate required fields
            required_fields = ['name', 'price_per_kg', 'quantity_available', 'location']
            for field in required_fields:
                if not data.get(field):
                    return Response({
                        'success': False,
                        'error': f'{field} is required'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create product
            product = Product.objects.create(
                name=data['name'],
                price_per_kg=data['price_per_kg'],
                quantity_available=data['quantity_available'],
                location=data['location'],
                description=data.get('description', ''),
                harvest_date=data.get('harvest_date'),
                farmer=request.user
            )
            
            logger.info(f"Product created successfully: {product.name}")
            
            serializer = ProductSerializer(product)
            return Response({
                'success': True,
                'product': serializer.data,
                'message': 'Product added successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to create product'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
