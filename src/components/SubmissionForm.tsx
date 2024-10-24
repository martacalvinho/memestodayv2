import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useMemeStore } from '../store/MemeStore';

const SubmissionForm: React.FC = () => {
  const [memeName, setMemeName] = useState('');
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  const { findSimilarMeme, addMeme, currentUser } = useMemeStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMemeName(value);
    setError('');

    if (value.trim()) {
      const similarMeme = findSimilarMeme(value);
      if (similarMeme) {
        setSuggestion(similarMeme.name);
      } else {
        setSuggestion(null);
      }
    } else {
      setSuggestion(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memeName.trim()) {
      setError('Please enter a memecoin name');
      return;
    }

    if (!memeName.includes('$')) {
      setError('Memecoin name must include a $ symbol');
      return;
    }

    if (memeName.split(' ').length > 1) {
      setError('Memecoin name must be a single word');
      return;
    }

    const finalName = suggestion || memeName;
    addMeme(finalName, currentUser?.id || 1);
    setMemeName('');
    setSuggestion(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-4">See what memecoins degens are loving today</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={memeName}
            onChange={handleInputChange}
            placeholder="Memecoin Name (e.g. $PEPE)"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md"
          />
          {suggestion && (
            <div 
              className="absolute w-full bg-gray-700 mt-1 rounded-md p-2 cursor-pointer hover:bg-gray-600"
              onClick={() => {
                setMemeName(suggestion);
                setSuggestion(null);
              }}
            >
              {suggestion}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-md"
        >
          Submit
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-500 text-white p-3 rounded-md flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <h3 className="font-medium mb-2">Rules:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>One submission per day</li>
          <li>Must include $ symbol</li>
          <li>Must be a single word</li>
        </ul>
      </div>
    </div>
  );
};

export default SubmissionForm;