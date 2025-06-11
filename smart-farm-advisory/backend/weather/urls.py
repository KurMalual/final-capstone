from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeatherDataViewSet, WeatherAlertViewSet

router = DefaultRouter()
router.register(r'data', WeatherDataViewSet)
router.register(r'alerts', WeatherAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
