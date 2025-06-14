# Generated by Django 4.2 on 2025-06-10 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WeatherAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=100)),
                ('alert_type', models.CharField(choices=[('rain', 'Heavy Rain'), ('drought', 'Drought'), ('storm', 'Storm'), ('frost', 'Frost'), ('heat', 'Heat Wave')], max_length=20)),
                ('message', models.TextField()),
                ('severity', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')], max_length=20)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='WeatherData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=100)),
                ('temperature', models.FloatField()),
                ('humidity', models.FloatField()),
                ('rainfall', models.FloatField()),
                ('wind_speed', models.FloatField()),
                ('weather_condition', models.CharField(max_length=50)),
                ('date', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
