from django.db import models

class SpeechAnalysis(models.Model):
    # What user was supposed to read
    reference_text = models.TextField()

    # What system actually recognized from audio
    recognized_text = models.TextField()

    # Audio file of the attempt
    audio_file = models.FileField(upload_to='uploads/')

    # Accuracy result
    accuracy_percent = models.FloatField()
    missed_words = models.JSONField(default=list)
    extra_words = models.JSONField(default=list)

    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Speech #{self.id} - {round(self.accuracy_percent,2)}%"
