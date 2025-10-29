from rest_framework import serializers
from .models import SpeechAnalysis

class SpeechAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeechAnalysis
        fields = '__all__'
