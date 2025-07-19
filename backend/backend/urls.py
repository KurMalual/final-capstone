"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers



from equipment.views import EquipmentViewSet, EquipmentRentalRequestViewSet
from marketplace.views import ProductViewSet, ProductOrderViewSet
from transport.views import TransportViewSet, TransportRequestViewSet
from users.views import UserViewSet
from education.views import EducationalResourceViewSet
from users.views import DashboardSummaryView


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'equipment-rental-requests', EquipmentRentalRequestViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-orders', ProductOrderViewSet)
router.register(r'transports', TransportViewSet)
router.register(r'transport-requests', TransportRequestViewSet)
router.register(r'educational-resources', EducationalResourceViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('api-auth/', include('rest_framework.urls')),
]
