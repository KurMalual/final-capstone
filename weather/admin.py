from django.contrib import admin
from .models import WeatherData, WeatherAlert


@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ['location', 'temperature', 'humidity', 'weather_condition', 'date']
    list_filter = ['weather_condition', 'date']
    search_fields = ['location']


@admin.register(WeatherAlert)
class WeatherAlertAdmin(admin.ModelAdmin):
    list_display = ['location', 'alert_type', 'severity', 'is_active', 'start_date']
    list_filter = ['alert_type', 'severity', 'is_active']
    search_fields = ['location']
