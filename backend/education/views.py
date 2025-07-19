
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import EducationalResource
from .serializers import EducationalResourceSerializer

class EducationalResourceViewSet(viewsets.ModelViewSet):
    queryset = EducationalResource.objects.all().order_by('-created_at')
    serializer_class = EducationalResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = EducationalResource.objects.all().order_by('-created_at')
        language = self.request.query_params.get('language')
        resource_type = self.request.query_params.get('resource_type')
        if language:
            queryset = queryset.filter(language__iexact=language)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        return queryset
