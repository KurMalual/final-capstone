#!/usr/bin/env python
import os
import sys
import django
import requests
import time

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from weather.models import WeatherData

def fetch_real_weather_data():
    api_key = '67d420588c363ed048911e7549549c98'
    south_sudan_cities = ['Juba', 'Wau', 'Malakal', 'Yei', 'Aweil']
    
    print("FETCHING REAL-TIME WEATHER DATA FOR SOUTH SUDAN")
    print("=" * 60)
    
    # Clear existing data
    print("Clearing existing hardcoded data...")
    WeatherData.objects.all().delete()
    print("✓ Cleared old data\n")
    
    successful_fetches = 0
    
    for city in south_sudan_cities:
        try:
            print(f"Fetching data for {city}...")
            
            # Fetch from OpenWeather API
            url = f'http://api.openweathermap.org/data/2.5/weather'
            params = {
                'q': f'{city},South Sudan',
                'appid': api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract weather data
                temperature = data['main']['temp']
                humidity = data['main']['humidity']
                description = data['weather'][0]['description']
                
                # Save to database
                weather_record = WeatherData.objects.create(
                    location=city,
                    temperature=temperature,
                    humidity=humidity,
                    description=description
                )
                
                print(f"✓ {city}: {temperature}°C, {description}, {humidity}% humidity")
                successful_fetches += 1
                
            else:
                print(f"✗ Failed to fetch {city}: HTTP {response.status_code}")
                print(f"   Response: {response.text[:100]}...")
                
        except requests.exceptions.Timeout:
            print(f"✗ Timeout fetching data for {city}")
        except Exception as e:
            print(f"✗ Error fetching {city}: {str(e)}")
        
        # Add small delay between requests
        time.sleep(1)
    
    print(f"\n" + "=" * 60)
    print(f"COMPLETED: {successful_fetches}/{len(south_sudan_cities)} cities updated with real API data")
    
    if successful_fetches > 0:
        print("\nFINAL WEATHER DATA (REAL-TIME FROM API):")
        print("-" * 40)
        for weather in WeatherData.objects.all().order_by('location'):
            print(f"{weather.location}: {weather.temperature}°C, {weather.description}")
    else:
        print("\nNo data was successfully fetched. Please check your internet connection and API key.")

if __name__ == '__main__':
    fetch_real_weather_data()
