# Generated by Django 4.2 on 2025-06-10 19:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('equipment_type', models.CharField(choices=[('tractor', 'Tractor'), ('harvester', 'Harvester'), ('planter', 'Planter'), ('sprayer', 'Sprayer'), ('irrigation', 'Irrigation Equipment'), ('other', 'Other')], max_length=20)),
                ('description', models.TextField()),
                ('daily_rate', models.DecimalField(decimal_places=2, max_digits=8)),
                ('location', models.CharField(max_length=100)),
                ('is_available', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment_owned', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EquipmentRental',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('total_cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('active', 'Active'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('equipment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment_rentals', to='equipment.equipment')),
                ('renter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment_rented', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
