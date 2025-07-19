
import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import WeatherData
from .serializers import WeatherDataSerializer

class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all().order_by('-timestamp')
    serializer_class = WeatherDataSerializer

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
        resp = requests.get(url)
        if resp.status_code != 200:
            return Response({'detail': 'Failed to fetch weather data.'}, status=resp.status_code)
        data = resp.json()
        weather = WeatherData.objects.create(
            location=location,
            temperature=data['main']['temp'],
            humidity=data['main']['humidity'],
            description=data['weather'][0]['description']
        )
        serializer = self.get_serializer(weather)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
