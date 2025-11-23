from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .utils import compare_speech_with_text

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def match_speech_api(request):
    """
    Compare spoken speech with displayed text.
    """
    audio_file = request.FILES.get('audio_file')
    text = request.data.get('text', '')

    if not audio_file or not text:
        return Response({"error": "audio_file and text are required"}, status=400)

    # Save temp audio and analyze
    result = compare_speech_with_text(audio_file, text)

    return Response(result)
