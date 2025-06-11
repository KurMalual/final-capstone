from django.contrib import admin
from .models import Equipment, EquipmentRental


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'equipment_type', 'daily_rate', 'owner', 'is_available']
    list_filter = ['equipment_type', 'is_available', 'created_at']
    search_fields = ['name', 'owner__username']


@admin.register(EquipmentRental)
class EquipmentRentalAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'renter', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'created_at']
    search_fields = ['equipment__name', 'renter__username']
