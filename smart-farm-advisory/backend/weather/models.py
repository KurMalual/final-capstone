from django.db import models


class WeatherData(models.Model):
    location = models.CharField(max_length=100)
    temperature = models.FloatField()
    humidity = models.FloatField()
    rainfall = models.FloatField()
    wind_speed = models.FloatField()
    weather_condition = models.CharField(max_length=50)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.location} - {self.date}"


class WeatherAlert(models.Model):
    ALERT_TYPE_CHOICES = [
        ('rain', 'Heavy Rain'),
        ('drought', 'Drought'),
        ('storm', 'Storm'),
        ('frost', 'Frost'),
        ('heat', 'Heat Wave'),
    ]
    
    location = models.CharField(max_length=100)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    message = models.TextField()
    severity = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.alert_type} alert for {self.location}"
