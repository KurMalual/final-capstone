from django.core.management.base import BaseCommand
from weather.weather_service import get_weather_service
import os

class Command(BaseCommand):
    help = 'Update weather data for all cities in South Sudan using real weather APIs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--city',
            type=str,
            help='Update weather for a specific city only',
        )

    def handle(self, *args, **options):
        weather_service = get_weather_service()
        
        # Check if OpenWeatherMap API key is available
        api_key = os.environ.get('OPENWEATHER_API_KEY')
        if api_key:
            weather_service.api_key = api_key
            self.stdout.write(
                self.style.SUCCESS('Using OpenWeatherMap API for accurate weather data')
            )
        else:
            self.stdout.write(
                self.style.WARNING('No OpenWeatherMap API key found. Using free weather service.')
            )
            self.stdout.write(
                self.style.WARNING('For better accuracy, get a free API key from: https://openweathermap.org/api')
            )
        
        if options['city']:
            # Update specific city
            city_name = options['city']
            self.stdout.write(f'Updating weather for {city_name}...')
            
            weather_data = weather_service.get_current_weather(city_name=city_name)
            if weather_data:
                # Save to database
                from weather.models import WeatherData
                weather_obj, created = WeatherData.objects.update_or_create(
                    location=weather_data["location"],
                    date__date=weather_data["date"].date(),
                    defaults={
                        "temperature": weather_data["temperature"],
                        "humidity": weather_data["humidity"],
                        "rainfall": weather_data["rainfall"],
                        "wind_speed": weather_data["wind_speed"],
                        "weather_condition": weather_data["weather_condition"],
                        "date": weather_data["date"]
                    }
                )
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Updated weather for {city_name}: {weather_data["temperature"]}°C, {weather_data["weather_condition"]}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'✗ Failed to fetch weather data for {city_name}')
                )
        else:
            # Update all cities
            updated_cities = weather_service.update_all_cities_weather()
            
            if updated_cities:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully updated weather for {len(updated_cities)} cities: {", ".join(updated_cities)}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR('Failed to update weather data for any cities')
                )
