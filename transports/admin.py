from django.contrib import admin
from .models import TransportationRequest


@admin.register(TransportationRequest)
class TransportationRequestAdmin(admin.ModelAdmin):
    list_display = ['pickup_location', 'delivery_location', 'requester', 'status', 'pickup_date']
    list_filter = ['status', 'created_at']
    search_fields = ['pickup_location', 'delivery_location', 'requester__username']
