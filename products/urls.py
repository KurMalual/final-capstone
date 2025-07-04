from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet

# Create separate routers for better organization
product_router = DefaultRouter()
product_router.register(r'', ProductViewSet, basename='product')

order_router = DefaultRouter()
order_router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    # Products endpoints: /api/products/
    path('', include(product_router.urls)),
    # Orders endpoints: /api/products/orders/
    path('orders/', include(order_router.urls)),
]
