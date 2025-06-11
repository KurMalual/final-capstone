from django.contrib import admin
from django.utils.html import format_html
from .models import VideoCategory, EducationalVideo


@admin.register(VideoCategory)
class VideoCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'video_count', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at',)
    
    def video_count(self, obj):
        return obj.videos.count()
    
    video_count.short_description = 'Number of Videos'
    
    def created_at(self, obj):
        return obj.id  # Since we don't have created_at in the model
    
    created_at.short_description = 'ID'


@admin.register(EducationalVideo)
class EducationalVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'views', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    list_editable = ('is_active',)
    readonly_fields = ('views', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Video Information', {
            'fields': ('title', 'description', 'category')
        }),
        ('Media Files', {
            'fields': ('video_url', 'thumbnail_url', 'duration')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Statistics', {
            'fields': ('views', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
