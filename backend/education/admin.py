

from django.contrib import admin
from .models import EducationalResource

@admin.register(EducationalResource)
class EducationalResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "resource_type", "language", "created_at")
