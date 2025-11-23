import speech_recognition as sr
import difflib

def compare_speech_with_text(audio_file, reference_text):
    recognizer = sr.Recognizer()
    audio_file.seek(0)
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
    try:
        recognized_text = recognizer.recognize_google(audio)
    except Exception:
        recognized_text = ""

    ref_words = reference_text.lower().split()
    spoken_words = recognized_text.lower().split()

    matcher = difflib.SequenceMatcher(None, ref_words, spoken_words)
    match_ratio = matcher.ratio() * 100

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