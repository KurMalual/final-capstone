from rest_framework import serializers
from .models import VideoCategory, EducationalVideo


class VideoCategorySerializer(serializers.ModelSerializer):
    video_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VideoCategory
        fields = ['id', 'name', 'description', 'created_at', 'video_count']
    
    def get_video_count(self, obj):
        return obj.videos.filter(is_active=True).count()


class EducationalVideoSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EducationalVideo
        fields = [
            'id', 'title', 'description', 'video_url', 'thumbnail_url',
            'category', 'category_name', 'duration', 'views', 'is_active',
            'created_at', 'updated_at'
        ]
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
    def get_video_url(self, obj):
        """Return the appropriate video URL"""
        video_url = obj.get_video_url()
        if video_url and not video_url.startswith('http'):
            # It's a local file, build absolute URL
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(video_url)
        return video_url
    
    def get_thumbnail_url(self, obj):
        """Return the appropriate thumbnail URL"""
        thumbnail_url = obj.get_thumbnail_url()
        if thumbnail_url and not thumbnail_url.startswith('http'):
            # It's a local file, build absolute URL
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(thumbnail_url)
        return thumbnail_url
