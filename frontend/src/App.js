import React, { useState, useRef } from 'react';
import Recorder from 'recorder-js';

function highlightText(reference, recognized, missed, extra) {
  const refWords = reference.split(' ');
  const recWords = recognized.split(' ');

  return refWords.map((word, idx) => {
    let style = {};
    if (missed && missed.includes(word.toLowerCase())) {
      style = { backgroundColor: '#ffcccc', color: 'red' };
    } else if (recWords.includes(word)) {
      style = { backgroundColor: '#ccffcc', color: 'green' };
    }
    return (
      <span key={idx} style={{ ...style, marginRight: 4 }}>
        {word}
      </span>
    );
  });
}

function App() {
  const [referenceText, setReferenceText] = useState('The quick brown fox jumps over the lazy dog');
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "audio/wav") {
      alert("Please upload a WAV file.");
      return;
    }
    setAudioFile(file);
  };

  const startRecording = async () => {
    setResult(null);
    setRecording(true);
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorderRef.current = new Recorder(audioContextRef.current, {
      onAnalysed: data => {}
    });
    recorderRef.current.init(stream);
    recorderRef.current.start();
  };

  const stopRecording = async () => {
    setRecording(false);
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      const file = new File([blob], 'speech.wav', { type: 'audio/wav' });
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('text', referenceText);

    try {
      const response = await fetch('http://localhost:8000/api/match_speech/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('API error');
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error analyzing speech. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>EchoSpeak: Speech Practice</h2>
      <div>
        <label>Reference Text:</label>
        <textarea
          rows={3}
          style={{ width: '100%' }}
          value={referenceText}
          onChange={e => setReferenceText(e.target.value)}
        />
      </div>
      <div style={{ margin: '20px 0' }}>
        <button onClick={startRecording} disabled={recording} style={{marginRight: 10}}>🎙️ Start Recording</button>
        <button onClick={stopRecording} disabled={!recording}>⏹️ Stop</button>
        {audioFile && (
          <audio controls src={URL.createObjectURL(audioFile)} style={{ display: 'block', marginTop: 10 }} />
        )}
      </div>
      { /*<div style={{ margin: '10px 0' }}>
        <input type="file" accept="audio/wav" onChange={handleAudioChange} />
        <span style={{marginLeft: 10, color: "#888"}}>or record above</span>
      </div> */}
      <div>
        <button onClick={handleSubmit} disabled={loading || !audioFile}>
          {loading ? 'Analyzing...' : 'Analyze Speech'}
        </button>
      </div>
      {result && (
        <div style={{marginTop: 30}}>
          <h3>Results</h3>
          <div>
            <strong>Reference:</strong>
            <div style={{ margin: '10px 0', fontSize: 18 }}>
              {highlightText(result.reference_text, result.recognized_text, result.missed_words, result.extra_words)}
            </div>
          </div>
          <div>
            <strong>Recognized:</strong>
            <div style={{ margin: '10px 0', fontSize: 18 }}>
              {highlightText(result.recognized_text, result.reference_text, result.extra_words, result.missed_words)}
            </div>
          </div>
          <div>
            <strong>Accuracy:</strong> {result.accuracy_percent}%
          </div>
          <div>
            <strong>Missed Words:</strong> {result.missed_words.join(', ')}
          </div>
          <div>
            <strong>Extra Words:</strong> {result.extra_words.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;