
import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from .models import WeatherData
from .serializers import WeatherDataSerializer

class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all().order_by('-timestamp')
    serializer_class = WeatherDataSerializer

    def get_permissions(self):
        """
        Allow public access to list/retrieve weather data,
        but require authentication for create/update/delete operations
        """
        if self.action in ['list', 'retrieve', 'south_sudan']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        """
        Return the most recent weather data for each location
        """
        # Get the latest weather record for each unique location
        latest_weather = []
        locations_seen = set()
        
        for weather in self.queryset:
            if weather.location not in locations_seen:
                latest_weather.append(weather)
                locations_seen.add(weather.location)
        
        serializer = self.get_serializer(latest_weather, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='south-sudan', permission_classes=[AllowAny])
    def south_sudan(self, request):
        """
        Get current weather data for major South Sudan cities
        """
        south_sudan_cities = ['Juba', 'Wau', 'Malakal', 'Yei', 'Aweil']
        weather_data = []
        
        for city in south_sudan_cities:
            try:
                # Get the most recent weather for this city
                weather = WeatherData.objects.filter(
                    location__icontains=city
                ).order_by('-timestamp').first()
                
                if weather:
                    weather_data.append(weather)
            except Exception as e:
                continue
        
        # If no data found, create some sample data
        if not weather_data:
            weather_data = self._create_sample_south_sudan_data()
        
        serializer = self.get_serializer(weather_data, many=True)
        return Response(serializer.data)

    def _create_sample_south_sudan_data(self):
        """Create sample weather data for South Sudan cities if none exists"""
        sample_data = [
            {'location': 'Juba', 'temperature': 28.5, 'humidity': 65, 'description': 'broken clouds'},
            {'location': 'Wau', 'temperature': 31.2, 'humidity': 58, 'description': 'scattered clouds'},
            {'location': 'Malakal', 'temperature': 29.8, 'humidity': 62, 'description': 'clear sky'},
        ]
        
        weather_objects = []
        for data in sample_data:
            weather, created = WeatherData.objects.get_or_create(
                location=data['location'],
                defaults={
                    'temperature': data['temperature'],
                    'humidity': data['humidity'],
                    'description': data['description']
                }
            )
            weather_objects.append(weather)
        
        return weather_objects

    @action(detail=False, methods=['get'], url_path='fetch')
    def fetch_weather(self, request):
        """
        Fetch real-time weather data from OpenWeather API for a given location (query param: location)
        and save it to the database.
        """
        location = request.query_params.get('location')
        if not location:
            return Response({'detail': 'Location parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = getattr(settings, 'OPENWEATHER_API_KEY', None)
        if not api_key:
            return Response({'detail': 'OpenWeather API key not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        url = f'https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric'
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code != 200:
                return Response({'detail': 'Failed to fetch weather data from OpenWeather API.'}, status=resp.status_code)
            
            data = resp.json()
            weather = WeatherData.objects.create(
                location=location,
                temperature=data['main']['temp'],
                humidity=data['main']['humidity'],
                description=data['weather'][0]['description']
            )
            serializer = self.get_serializer(weather)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except requests.exceptions.RequestException as e:
            return Response({'detail': f'Error fetching weather data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'detail': f'Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
