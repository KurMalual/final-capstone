import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from education.models import VideoCategory, EducationalVideo

def create_sample_videos():
    print("Creating sample educational videos...")
    
    # Create video categories
    categories_data = [
        {"name": "Planting", "description": "Learn proper planting techniques"},
        {"name": "Harvesting", "description": "Best practices for harvesting crops"},
        {"name": "Pest Control", "description": "Natural and effective pest control methods"},
        {"name": "Irrigation", "description": "Water management and irrigation systems"},
        {"name": "Livestock", "description": "Animal husbandry and care"},
        {"name": "Marketing", "description": "Selling and marketing your products"},
    ]
    
    categories = {}
    for cat_data in categories_data:
        category, created = VideoCategory.objects.get_or_create(
            name=cat_data["name"],
            defaults={"description": cat_data["description"]}
        )
        categories[cat_data["name"]] = category
        if created:
            print(f"Created category: {category.name}")
        else:
            print(f"Category already exists: {category.name}")
    
    # Create sample videos (without actual video files for now)
    videos_data = [
        {
            "title": "How to Plant Tomatoes",
            "description": "Learn the proper way to plant tomatoes for maximum yield. This video covers soil preparation, spacing, and watering techniques.",
            "category": "Planting",
            "duration": "8:30",
        },
        {
            "title": "Organic Pest Control Methods",
            "description": "Discover natural ways to protect your crops from pests without harmful chemicals. Safe for you and the environment.",
            "category": "Pest Control",
            "duration": "12:15",
        },
        {
            "title": "Efficient Irrigation Techniques",
            "description": "Learn how to water your crops efficiently and save water. Covers drip irrigation and scheduling.",
            "category": "Irrigation",
            "duration": "10:45",
        },
        {
            "title": "When and How to Harvest Vegetables",
            "description": "Know the right time to harvest your vegetables for best quality and storage life.",
            "category": "Harvesting",
            "duration": "6:20",
        },
        {
            "title": "Raising Healthy Chickens",
            "description": "Complete guide to chicken care, feeding, and housing for small-scale farmers.",
            "category": "Livestock",
            "duration": "15:30",
        },
        {
            "title": "Marketing Your Farm Products",
            "description": "Tips for selling your products at local markets and building customer relationships.",
            "category": "Marketing",
            "duration": "9:10",
        },
    ]
    
    for video_data in videos_data:
        category = categories[video_data["category"]]
        video, created = EducationalVideo.objects.get_or_create(
            title=video_data["title"],
            defaults={
                "description": video_data["description"],
                "category": category,
                "duration": video_data["duration"],
                "is_active": True,
            }
        )
        if created:
            print(f"Created video: {video.title}")
        else:
            print(f"Video already exists: {video.title}")
    
    print(f"\nSample data creation completed!")
    print(f"Categories created: {VideoCategory.objects.count()}")
    print(f"Videos created: {EducationalVideo.objects.count()}")

if __name__ == "__main__":
    create_sample_videos()
