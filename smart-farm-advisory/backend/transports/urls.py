from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransportationRequestViewSet, VehicleViewSet

router = DefaultRouter()
router.register(r'requests', TransportationRequestViewSet)
router.register(r'vehicles', VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('available_jobs/', TransportationRequestViewSet.as_view({'get': 'available_jobs'}), name='available_jobs'),
    path('my_vehicles/', VehicleViewSet.as_view({'get': 'my_vehicles'}), name='my_vehicles'),
]
