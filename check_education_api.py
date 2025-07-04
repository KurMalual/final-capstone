#!/usr/bin/env python3
"""
Check Education API functionality
"""
import os
import sys
import django
import json

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from django.core.management import call_command
from education.models import EducationalVideo, VideoCategory
from education.serializers import EducationalVideoSerializer
from django.db import connection

def main():
    print("=== Education API Check ===\n")
    
    # Check database schema
    print("Checking database schema...\n")
    
    with connection.cursor() as cursor:
        # Check EducationalVideo table
        cursor.execute("PRAGMA table_info(education_educationalvideo)")
        columns = cursor.fetchall()
        print("EducationalVideo columns:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
        
        print()
        
        # Check VideoCategory table
        cursor.execute("PRAGMA table_info(education_videocategory)")
        columns = cursor.fetchall()
        print("VideoCategory columns:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
    
    print()
    
    # Check videos in database
    print("Checking videos in database...\n")
    videos = EducationalVideo.objects.all().order_by('-id')
    print(f"Found {videos.count()} videos in database")
    
    for video in videos:
        print(f"  - {video.id}: {video.title} (Category: {video.category.name if video.category else 'None'})")
        print(f"    URL: {video.video_url or 'None':<40}")
        print(f"    Thumbnail: {video.thumbnail_url or 'None'}")
        print(f"    Active: {video.is_active}")
        print()
    
    # Test serialization
    if videos.exists():
        sample_video = videos.first()
        serializer = EducationalVideoSerializer(sample_video)
        print("Sample serialized video:")
        print(json.dumps(serializer.data, indent=2))
        print()
    
    # Check categories
    print("Checking categories in database...\n")
    categories = VideoCategory.objects.all().order_by('id')
    print(f"Found {categories.count()} categories in database")
    
    for category in categories:
        video_count = EducationalVideo.objects.filter(category=category).count()
        print(f"  - {category.id}: {category.name}")
        print(f"    Videos: {video_count}")
        print()
    
    print("Done!")

if __name__ == "__main__":
    main()
