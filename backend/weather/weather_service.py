import requests
import os
import json
from datetime import datetime, timedelta
from .models import WeatherData, WeatherAlert
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        # You can get a free API key from OpenWeatherMap
        self.api_key = os.getenv('OPENWEATHER_API_KEY', 'demo_key')
        self.base_url = "http://api.openweathermap.org/data/2.5"
        
        # South Sudan cities coordinates
        self.south_sudan_cities = {
            'Juba': {'lat': 4.8594, 'lon': 31.5713},
            'Wau': {'lat': 7.7028, 'lon': 28.0075},
            'Malakal': {'lat': 9.5334, 'lon': 31.6605},
            'Yei': {'lat': 4.0951, 'lon': 30.6781},
            'Aweil': {'lat': 8.7677, 'lon': 27.3925},
            'Bentiu': {'lat': 9.2332, 'lon': 29.7826},
            'Bor': {'lat': 6.2088, 'lon': 31.5594},
            'Torit': {'lat': 4.4134, 'lon': 32.5823}
        }

    def get_current_weather(self, city_name='Juba'):
        """Get current weather for a South Sudan city"""
        try:
            # Get coordinates for the city
            if city_name in self.south_sudan_cities:
                coords = self.south_sudan_cities[city_name]
                lat, lon = coords['lat'], coords['lon']
            else:
                # Default to Juba if city not found
                lat, lon = 4.8594, 31.5713
                city_name = 'Juba'

            # Make API request
            url = f"{self.base_url}/weather"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract weather data
                weather_data = {
                    'location': city_name,
                    'temperature': data['main']['temp'],
                    'humidity': data['main']['humidity'],
                    'weather_condition': data['weather'][0]['description'].title(),
                    'wind_speed': data['wind'].get('speed', 0) * 3.6,  # Convert m/s to km/h
                    'rainfall': data.get('rain', {}).get('1h', 0),  # mm in last hour
                    'date': datetime.now()
                }
                
                return weather_data
            else:
                # Return mock data if API fails
                return self.get_mock_weather_data(city_name)
                
        except Exception as e:
            print(f"Weather API error: {e}")
            return self.get_mock_weather_data(city_name)

    def get_mock_weather_data(self, city_name='Juba'):
        """Return realistic mock weather data for South Sudan"""
        import random
        
        # Realistic South Sudan weather ranges
        temp_ranges = {
            'Juba': (25, 35),
            'Wau': (23, 33),
            'Malakal': (24, 34),
            'Yei': (22, 30),
            'Aweil': (26, 36),
            'Bentiu': (25, 35),
            'Bor': (24, 34),
            'Torit': (23, 31)
        }
        
        conditions = [
            'Clear Sky', 'Partly Cloudy', 'Scattered Clouds', 
            'Light Rain', 'Thunderstorm', 'Overcast'
        ]
        
        temp_range = temp_ranges.get(city_name, (25, 35))
        
        return {
            'location': city_name,
            'temperature': random.randint(temp_range[0], temp_range[1]),
            'humidity': random.randint(40, 80),
            'weather_condition': random.choice(conditions),
            'wind_speed': random.randint(5, 25),
            'rainfall': random.randint(0, 15),
            'date': datetime.now()
        }

    def update_all_cities_weather(self):
        """Update weather for all South Sudan cities"""
        updated_cities = []
        
        for city in self.south_sudan_cities.keys():
            try:
                weather_data = self.get_current_weather(city)
                
                # Save to database
                WeatherData.objects.update_or_create(
                    location=city,
                    defaults=weather_data
                )
                
                updated_cities.append(city)
                
            except Exception as e:
                print(f"Failed to update weather for {city}: {e}")
                
        return updated_cities

# Utility function to get weather service instance
def get_weather_service():
    return WeatherService()
