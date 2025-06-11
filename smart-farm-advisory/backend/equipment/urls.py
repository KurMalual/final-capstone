from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, EquipmentRentalViewSet

router = DefaultRouter()
router.register(r'', EquipmentViewSet)
router.register(r'rentals', EquipmentRentalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
