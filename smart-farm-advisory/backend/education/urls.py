from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoCategoryViewSet, EducationalVideoViewSet, VideoViewController

router = DefaultRouter()
router.register(r'categories', VideoCategoryViewSet, basename='video-category')
router.register(r'videos', EducationalVideoViewSet, basename='educational-video')

urlpatterns = [
    path('', include(router.urls)),
    path('videos/<int:video_id>/view/', VideoViewController.as_view(), name='video-view'),
]
