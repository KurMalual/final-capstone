from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WeatherData, WeatherAlert
from .serializers import WeatherDataSerializer, WeatherAlertSerializer
from .weather_service import get_weather_service


class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = WeatherData.objects.all()
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        location = request.query_params.get('location', 'Juba')
        
        # Get fresh weather data
        weather_service = get_weather_service()
        weather_data = weather_service.get_current_weather(city_name=location)
        
        if weather_data:
            # Save to database
            weather_obj, created = WeatherData.objects.update_or_create(
                location=weather_data['location'],
                defaults=weather_data
            )
            
            serializer = self.get_serializer(weather_obj)
            return Response(serializer.data)
        
        return Response({'message': 'No weather data available'}, status=404)
    
    @action(detail=False, methods=['post'])
    def update_all(self, request):
        """Update weather for all major cities"""
        weather_service = get_weather_service()
        updated_cities = weather_service.update_all_cities_weather()
        
        return Response({
            'message': f'Weather updated for {len(updated_cities)} cities',
            'cities': updated_cities
        })


class WeatherAlertViewSet(viewsets.ModelViewSet):
    queryset = WeatherAlert.objects.all()
    serializer_class = WeatherAlertSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = WeatherAlert.objects.filter(is_active=True)
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        return queryset.order_by('-created_at')
