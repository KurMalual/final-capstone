from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import VideoCategory, EducationalVideo
from .serializers import VideoCategorySerializer, EducationalVideoSerializer


class VideoCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VideoCategory.objects.all()
    serializer_class = VideoCategorySerializer


class EducationalVideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EducationalVideo.objects.filter(is_active=True)
    serializer_class = EducationalVideoSerializer
    
    def get_queryset(self):
        queryset = EducationalVideo.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category)
        return queryset.order_by('-created_at')


class VideoViewController(APIView):
    def post(self, request, video_id):
        try:
            video = get_object_or_404(EducationalVideo, id=video_id)
            video.views += 1
            video.save()
            return Response({
                'status': 'success', 
                'message': 'View recorded',
                'views': video.views
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
