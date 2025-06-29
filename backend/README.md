# Smart Farm Connect - Backend

A Django REST API backend for the Smart Farm Connect platform, designed to support agricultural activities in South Sudan.

## Features

- **User Management**: Farmers, buyers, transporters, and equipment sellers
- **Product Marketplace**: Real-time product listings and orders
- **Equipment Rental**: Agricultural equipment sharing platform
- **Transportation Services**: Logistics coordination for agricultural products
- **Weather Information**: Real-time weather data for South Sudanese cities
- **Weather Alerts**: Automated alerts for farming-critical weather conditions

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### 2. Installation

\`\`\`bash
# Clone the repository
cd backend

# Install dependencies
pip install -r requirements.txt

# Initialize the platform
python initialize_platform.py
\`\`\`

### 3. Environment Variables (Optional)

For enhanced weather data accuracy, set up a free OpenWeatherMap API key:

\`\`\`bash
# Get a free API key from: https://openweathermap.org/api
export OPENWEATHER_API_KEY=your_api_key_here

# For production, also set:
export DJANGO_SECRET_KEY=your_secret_key
export DEBUG=False
export ALLOWED_HOSTS=your_domain.com
\`\`\`

### 4. Running the Server

\`\`\`bash
# Start the development server
python manage.py runserver

# The API will be available at: http://localhost:8000/api/
\`\`\`

### 5. Admin Panel

Access the Django admin panel at: http://localhost:8000/admin/

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create new product (farmers only)
- `GET /api/products/my_products/` - Get user's products

### Equipment
- `GET /api/equipment/` - List all equipment
- `POST /api/equipment/` - Add new equipment (equipment sellers only)
- `POST /api/equipment/rentals/` - Request equipment rental

### Transportation
- `GET /api/transports/` - List transport requests
- `POST /api/transports/` - Create transport request
- `GET /api/transports/available_jobs/` - Available jobs for transporters

### Weather
- `GET /api/weather/data/` - Weather data for all cities
- `GET /api/weather/data/current/?location=Juba` - Current weather for specific city
- `GET /api/weather/alerts/` - Active weather alerts

## Real Data Sources

### Weather Data
The platform fetches real weather data from:
1. **OpenWeatherMap API** (primary, requires free API key)
2. **wttr.in** (fallback, no API key required)

Weather data is automatically updated and includes:
- Temperature, humidity, wind speed
- Rainfall measurements
- Weather conditions
- Automated farming alerts

### User-Generated Content
All other data (products, equipment, transport requests) comes from real users:
- Farmers list their actual products
- Equipment owners list real equipment for rent
- Transporters accept real transport jobs
- Buyers place actual orders

## Management Commands

\`\`\`bash
# Update weather data manually
python manage.py update_weather

# Update weather for specific city
python manage.py update_weather --city Juba

# Create admin user
python manage.py createsuperuser
\`\`\`

## Database

The platform uses SQLite by default for development. For production, configure PostgreSQL or MySQL using environment variables:

\`\`\`bash
export DB_ENGINE=django.db.backends.postgresql
export DB_NAME=smart_farm_db
export DB_USER=your_db_user
export DB_PASSWORD=your_db_password
export DB_HOST=localhost
export DB_PORT=5432
\`\`\`

## Logging

Application logs are written to `smart_farm.log` in the backend directory. Weather service activities are logged for monitoring API usage and data quality.

## Production Deployment

For production deployment:

1. Set `DEBUG=False`
2. Configure a production database
3. Set up proper static file serving
4. Use a production WSGI server (gunicorn, uwsgi)
5. Configure HTTPS and security headers
6. Set up automated weather data updates via cron jobs

## Support

For technical support or questions about the Smart Farm Connect platform, please contact the development team.
\`\`\`

Finally, let's create a requirements.txt file:
