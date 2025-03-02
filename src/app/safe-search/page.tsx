'use client';

import { useState } from 'react';
import * as nsfwjs from 'nsfwjs';
import '@tensorflow/tfjs';

type NSFWPrediction = {
    className: string;
    probability: number;
  };
  
export default function SafeSearchTest() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [results, setResults] = useState<NSFWPrediction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please select an image to analyze.');
      return;
    }

    try {
      setError(null);
      setResults(null);

      // Load the NSFW.js model
      const model = await nsfwjs.load();

      // Create an image element
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = async () => {
        // Analyze the image
        const predictions = await model.classify(img);
        setResults(predictions);
      };
    } catch (err: any) {
      setError('Failed to analyze image.');
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImageUrl(file ? URL.createObjectURL(file) : '');
    setResults(null);
    setError(null);
  };

  return (
    <div>
      <h1>SafeSearch Test</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageUrl && <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%', marginTop: '10px' }} />}
      <button onClick={handleAnalyze} disabled={!imageFile}>
        Analyze
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <div>
          <h2>Results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                {result.className}: {(result.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
