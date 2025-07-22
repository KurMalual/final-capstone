

from django.contrib import admin
from .models import EducationalResource

@admin.register(EducationalResource)
class EducationalResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "resource_type", "language", "created_at")
    list_filter = ("resource_type", "language", "created_at")
    search_fields = ("title", "description")
    list_per_page = 20
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("title", "description")
        }),
        ("Resource Details", {
            "fields": ("resource_type", "language", "file")
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return ("created_at",)
        return ()
