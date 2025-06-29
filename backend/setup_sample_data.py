import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.core.management import call_command

def setup_sample_data():
    """Setup sample data for the Smart Farm Connect platform"""
    
    print("=== Setting up Smart Farm Connect Sample Data ===")
    
    try:
        # Create sample data
        call_command('create_sample_data')
        
        print("\n✅ Sample data setup complete!")
        print("\n🔑 Login Credentials:")
        print("Farmer: farmer1 / password123")
        print("Buyer: buyer1 / password123")
        print("Transporter: transporter1 / password123")
        print("Equipment Seller: equipment1 / password123")
        
        print("\n🌐 You can now:")
        print("1. Start the Django server: python manage.py runserver")
        print("2. Start the React frontend: npm start (in frontend directory)")
        print("3. Visit http://localhost:3000 to see the platform")
        
    except Exception as e:
        print(f"❌ Error setting up sample data: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_sample_data()
