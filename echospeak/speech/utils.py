import speech_recognition as sr
import difflib

def compare_speech_with_text(audio_path, reference_text):
    """
    Compare user's spoken words with reference text.
    """

    # Convert speech to text
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)

    try:
        recognized_text = recognizer.recognize_google(audio)
    except:
        recognized_text = ""

    # Clean up and split
    ref_words = reference_text.lower().split()
    spoken_words = recognized_text.lower().split()

    # Compare word by word
    matcher = difflib.SequenceMatcher(None, ref_words, spoken_words)
    match_ratio = matcher.ratio() * 100

    # Find missed words
    missed_words = list(set(ref_words) - set(spoken_words))
    extra_words = list(set(spoken_words) - set(ref_words))

    result = {
        "reference_text": reference_text,
        "recognized_text": recognized_text,
        "accuracy_percent": round(match_ratio, 2),
        "missed_words": missed_words,
        "extra_words": extra_words
    }

    return result
