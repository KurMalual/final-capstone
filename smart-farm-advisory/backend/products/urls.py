from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'', ProductViewSet)
router.register(r'orders', OrderViewSet, basename='order')  # Added basename parameter

urlpatterns = [
    path('', include(router.urls)),
]
