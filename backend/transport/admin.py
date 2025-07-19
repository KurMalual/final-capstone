

from django.contrib import admin
from .models import Transport, TransportRequest

@admin.register(Transport)
class TransportAdmin(admin.ModelAdmin):
    list_display = ("vehicle_name", "owner", "available", "price_per_trip", "created_at")

@admin.register(TransportRequest)
class TransportRequestAdmin(admin.ModelAdmin):
    list_display = ("transport", "farmer", "status", "created_at", "updated_at")
