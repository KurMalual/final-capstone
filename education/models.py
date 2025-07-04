from django.db import models
from django.conf import settings
import os


class VideoCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Video Categories"
        ordering = ['name']


class EducationalVideo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # File upload fields (new)
    video_file = models.FileField(
        upload_to='educational_videos/', 
        blank=True, 
        null=True,
        help_text="Upload a video file (MP4, AVI, MOV, etc.)"
    )
    thumbnail_file = models.ImageField(
        upload_to='video_thumbnails/', 
        blank=True, 
        null=True,
        help_text="Upload a thumbnail image"
    )
    
    # URL fields (new)
    video_url = models.URLField(
        blank=True, 
        null=True,
        help_text="Or provide a video URL (YouTube, Vimeo, etc.)"
    )
    thumbnail_url = models.URLField(
        blank=True, 
        null=True,
        help_text="Or provide a thumbnail URL"
    )
    
    # Existing fields
    category = models.ForeignKey(
        VideoCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='videos'
    )
    duration = models.CharField(
        max_length=10, 
        blank=True, 
        null=True,
        help_text="Format: MM:SS or HH:MM:SS"
    )
    views = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    def __str__(self):
        return self.title
    
    def get_video_url(self):
        """Return the appropriate video URL (file or external URL)"""
        if self.video_file:
            return self.video_file.url
        return self.video_url
    
    def get_thumbnail_url(self):
        """Return the appropriate thumbnail URL (file or external URL)"""
        if self.thumbnail_file:
            return self.thumbnail_file.url
        return self.thumbnail_url
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Educational Video"
        verbose_name_plural = "Educational Videos"
