from django.urls import path
from .views import match_speech_api

urlpatterns = [
    path('match_speech/', match_speech_api, name='match_speech_api'),
]

# router = DefaultRouter()
# router.register(r'speech', SpeechAnalysisViewSet)

# urlpatterns = router.urls
