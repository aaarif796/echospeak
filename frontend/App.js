import React, { useState } from 'react';

function highlightText(reference, recognized, missed, extra) {
  const refWords = reference.split(' ');
  const recWords = recognized.split(' ');

  return refWords.map((word, idx) => {
    let style = {};
    if (missed && missed.includes(word.toLowerCase())) {
      style = { backgroundColor: '#ffcccc', color: 'red' }; // Missed words
    } else if (recWords.includes(word)) {
      style = { backgroundColor: '#ccffcc', color: 'green' }; // Correct words
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

  const handleAudioChange = (e) => {
    setAudioFile(e.target.files[0]);
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
      <h2>Speech Practice</h2>
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
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
        <button onClick={handleSubmit} disabled={loading || !audioFile}>
          {loading ? 'Analyzing...' : 'Analyze Speech'}
        </button>
      </div>
      {result && (
        <div>
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