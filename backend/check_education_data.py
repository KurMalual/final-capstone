import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from education.models import EducationalVideo, VideoCategory

def check_education_data():
    """Check what education data exists in the database"""
    
    print("=== CHECKING EDUCATION DATA ===")
    
    try:
        # Check categories
        categories = VideoCategory.objects.all()
        print(f"\nFound {categories.count()} video categories:")
        for category in categories:
            print(f"  - {category.name}")
        
        # Check videos
        videos = EducationalVideo.objects.all()
        print(f"\nFound {videos.count()} educational videos:")
        for video in videos:
            print(f"  - {video.title} (Category: {video.category.name if video.category else 'None'}, Active: {video.is_active})")
        
        # Check active videos specifically
        active_videos = EducationalVideo.objects.filter(is_active=True)
        print(f"\nFound {active_videos.count()} ACTIVE educational videos:")
        for video in active_videos:
            print(f"  - {video.title}")
            
    except Exception as e:
        print(f"Error checking data: {e}")

if __name__ == "__main__":
    check_education_data()
