

from django.contrib import admin
from .models import Equipment, EquipmentRentalRequest

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "available", "created_at")

@admin.register(EquipmentRentalRequest)
class EquipmentRentalRequestAdmin(admin.ModelAdmin):
    list_display = ("equipment", "farmer", "status", "created_at", "updated_at")
