#!/usr/bin/env python

def getWeatherAdvice(description, temperature):
    """
    Improved weather advice logic with consistent temperature thresholds
    """
    desc = description.lower() if description else ''
    temp = float(temperature) if temperature else 0

    # Priority 1: Check for rain/precipitation first
    if any(word in desc for word in ['rain', 'drizzle', 'shower']):
        return { 'text': 'Natural irrigation for crops', 'color': 'info' }
    
    # Priority 2: Check temperature ranges  
    if temp > 35:
        return { 'text': 'Too hot - provide shade', 'color': 'danger' }
    elif temp < 15:
        return { 'text': 'Too cool for most crops', 'color': 'warning' }
    
    # Priority 3: Check sky conditions for good farming weather (15-35°C)
    if any(word in desc for word in ['clear', 'sunny']):
        return { 'text': 'Excellent for farming', 'color': 'success' }
    elif any(word in desc for word in ['few clouds', 'scattered clouds']):
        return { 'text': 'Good for farming', 'color': 'success' }
    elif any(word in desc for word in ['broken clouds', 'overcast']):
        return { 'text': 'Fair conditions', 'color': 'warning' }
    else:
        return { 'text': 'Moderate conditions', 'color': 'secondary' }

# Test with current weather data
weather_data = [
    {'location': 'Aweil', 'temperature': 31.2, 'description': 'few clouds'},
    {'location': 'Juba', 'temperature': 28.6, 'description': 'broken clouds'},
    {'location': 'Malakal', 'temperature': 29.1, 'description': 'clear sky'},
    {'location': 'Wau', 'temperature': 26.3, 'description': 'scattered clouds'},
    {'location': 'Yei', 'temperature': 25.8, 'description': 'light rain'}
]

print("Weather Advice Testing:")
print("=" * 50)

for city_data in weather_data:
    advice = getWeatherAdvice(city_data['description'], city_data['temperature'])
    print(f"{city_data['location']}: {city_data['temperature']}°C, {city_data['description']}")
    print(f"  -> {advice['text']} ({advice['color']})")
    print()
