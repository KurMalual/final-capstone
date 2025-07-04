import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from education.models import VideoCategory, EducationalVideo
import json

print("=== EDUCATION DEBUG REPORT ===")
print()

# Check categories
categories = VideoCategory.objects.all()
print(f"📁 Total Categories: {categories.count()}")
for cat in categories:
    print(f"   - {cat.name}: {cat.videos.count()} videos")
print()

# Check videos
videos = EducationalVideo.objects.all()
active_videos = videos.filter(is_active=True)

print(f"🎥 Total Videos: {videos.count()}")
print(f"✅ Active Videos: {active_videos.count()}")
print(f"❌ Inactive Videos: {videos.filter(is_active=False).count()}")
print()

if videos.exists():
    print("📋 VIDEO DETAILS:")
    for video in videos:
        print(f"   ID: {video.id}")
        print(f"   Title: {video.title}")
        print(f"   Active: {video.is_active}")
        print(f"   Category: {video.category}")
        print(f"   Video URL: {video.video_url}")
        print(f"   Thumbnail URL: {video.thumbnail_url}")
        print("   ---")
else:
    print("❌ No videos found in database!")

print()
print("🔧 ACTIVATION FIX:")
if videos.filter(is_active=False).exists():
    print("   Activating all videos...")
    for video in videos:
        video.is_active = True
        video.save()
    print("   ✅ All videos activated!")
else:
    print("   ✅ All videos are already active!")

print()
print("🌐 API TEST:")
try:
    from education.serializers import EducationalVideoSerializer
    from django.http import HttpRequest
    
    # Create a mock request
    request = HttpRequest()
    request.method = 'GET'
    
    # Serialize the data
    serializer = EducationalVideoSerializer(active_videos, many=True, context={'request': request})
    api_data = serializer.data
    
    print(f"   API would return {len(api_data)} videos")
    if api_data:
        print("   Sample video data:")
        sample = api_data[0]
        for key, value in sample.items():
            print(f"     {key}: {value}")
    else:
        print("   ❌ API returns empty data!")
        
except Exception as e:
    print(f"   ❌ API Error: {e}")

print()
print("=== END DEBUG REPORT ===")
