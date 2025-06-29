from django.urls import path
from . import views

urlpatterns = [
    path('', views.EquipmentListCreateView.as_view(), name='equipment-list-create'),
    path('my_equipment/', views.MyEquipmentView.as_view(), name='my-equipment'),
    path('rental_requests/', views.RentalRequestsView.as_view(), name='rental-requests'),
    path('active_rentals/', views.ActiveRentalsView.as_view(), name='active-rentals'),
    path('<int:pk>/', views.EquipmentDetailView.as_view(), name='equipment-detail'),
    path('<int:pk>/rent/', views.RentEquipmentView.as_view(), name='rent-equipment'),
]
