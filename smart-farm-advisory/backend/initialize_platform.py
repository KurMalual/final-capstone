import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()

def initialize_platform():
    """Initialize the Smart Farm Connect platform for real use"""
    
    print("🌱 Initializing Smart Farm Connect Platform...")
    
    try:
        # Run migrations
        print("📊 Setting up database...")
        call_command('migrate')
        
        # Create superuser if none exists
        if not User.objects.filter(is_superuser=True).exists():
            print("👤 Creating admin user...")
            print("Please create an admin account:")
            call_command('createsuperuser')
        
        # Update weather data with real data
        print("🌤️  Fetching real weather data...")
        try:
            call_command('update_weather')
            print("✓ Weather data updated successfully")
        except Exception as e:
            print(f"⚠️  Weather update failed: {e}")
            print("   Weather data will be updated when users access the platform")
        
        print("\n✅ Platform initialized successfully!")
        print("\n📋 Next Steps:")
        print("1. Start the Django server: python manage.py runserver")
        print("2. Start the React frontend: npm start (in frontend directory)")
        print("3. Visit http://localhost:3000 to access the platform")
        print("4. Visit http://localhost:8000/admin to access admin panel")
        
        print("\n🔧 Configuration:")
        print("- Users can register directly through the frontend")
        print("- Weather data is fetched from real sources")
        print("- All data will be real user-generated content")
        
        # Optional: Set up OpenWeatherMap API key
        print("\n🌤️  Weather API Setup (Optional):")
        print("For more accurate weather data, get a free API key from:")
        print("https://openweathermap.org/api")
        print("Then set it in your environment: export OPENWEATHER_API_KEY=your_key")
        
    except Exception as e:
        print(f"❌ Error initializing platform: {e}")
        sys.exit(1)

if __name__ == "__main__":
    initialize_platform()
