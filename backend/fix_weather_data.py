#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from weather.models import WeatherData

def fix_weather_data():
    print("Current weather data:")
    print("-" * 50)
    
    # Show all current data
    for w in WeatherData.objects.all().order_by('location', '-timestamp'):
        print(f"ID {w.id}: {w.location} - {w.temperature}°C, {w.description}, {w.timestamp}")
    
    print("\n" + "=" * 50)
    print("Cleaning up duplicates and standardizing...")
    
    # Define the standard South Sudan cities with proper capitalization
    standard_cities = {
        'juba': 'Juba',
        'wau': 'Wau', 
        'malakal': 'Malakal',
        'yei': 'Yei',
        'aweil': 'Aweil'
    }
    
    # Clean up and standardize
    for old_name, new_name in standard_cities.items():
        # Find all records for this city (case-insensitive)
        records = WeatherData.objects.filter(location__iexact=old_name).order_by('-timestamp')
        
        if records.exists():
            # Keep the most recent record and update its location name
            latest_record = records.first()
            latest_record.location = new_name
            latest_record.save()
            print(f"Updated {old_name} -> {new_name}: {latest_record.temperature}°C, {latest_record.description}")
            
            # Delete older duplicates
            older_records = records[1:]  # Skip the first (most recent) record
            if older_records:
                older_count = len(older_records)
                for record in older_records:
                    record.delete()
                print(f"  Deleted {older_count} older duplicate(s)")
    
    print("\n" + "=" * 50)
    print("Final weather data:")
    print("-" * 50)
    
    for w in WeatherData.objects.all().order_by('location'):
        print(f"ID {w.id}: {w.location} - {w.temperature}°C, {w.description}")

if __name__ == '__main__':
    fix_weather_data()
