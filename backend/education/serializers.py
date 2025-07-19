from rest_framework import serializers
from .models import EducationalResource

class EducationalResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalResource
        fields = '__all__'
