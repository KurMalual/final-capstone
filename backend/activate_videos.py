# backend/activate_videos.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings')
django.setup()

from education.models import EducationalVideo

# Activate all videos
videos = EducationalVideo.objects.all()
count = 0

for video in videos:
    video.is_active = True
    video.save()
    count += 1

print(f"Successfully activated {count} videos!")