# Generated migration for adding image field to Equipment model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('equipment', '0002_vehicle'),  # Adjust this to your latest migration
    ]

    operations = [
        migrations.AddField(
            model_name='equipment',
            name='image',
            field=models.ImageField(upload_to='equipment_images/', null=True, blank=True),
        ),
    ]
