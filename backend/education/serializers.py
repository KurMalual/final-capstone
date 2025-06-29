from rest_framework import serializers
from .models import VideoCategory, EducationalVideo


class VideoCategorySerializer(serializers.ModelSerializer):
    video_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VideoCategory
        fields = ['id', 'name', 'description', 'video_count']
    
    def get_video_count(self, obj):
        return obj.videos.filter(is_active=True).count()


class EducationalVideoSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EducationalVideo
        fields = [
            'id', 'title', 'description', 'video_url', 'thumbnail_url',
            'category', 'category_name', 'duration', 'views', 'is_active',
            'created_at', 'updated_at'
        ]
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
