from django.db import models

class EducationalResource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('text', 'Text'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPE_CHOICES)
    language = models.CharField(max_length=50, help_text='e.g. English, Arabic, Juba Arabic')
    file = models.FileField(upload_to='education_resources/')
    created_at = models.DateTimeField(auto_now_add=True)
