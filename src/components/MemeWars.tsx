import React, { useState } from 'react';
import { Upload, ImageIcon, Search, ThumbsUp, ThumbsDown, User, Hash, Trophy } from 'lucide-react';
import { useMemeStore } from '../store/MemeStore';

const MemeWars: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedMeme, setSuggestedMeme] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { 
    memes, 
    addMemePhoto, 
    findSimilarMeme, 
    getTopMemePhotos,
    memePhotos,
    voteMemePhoto 
  } = useMemeStore();

  const topMemePhotos = getTopMemePhotos();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleCoinInput = (value: string) => {
    setSelectedCoin(value);
    const similar = findSimilarMeme(value);
    if (similar) {
      setSuggestedMeme(similar.name);
    } else {
      setSuggestedMeme(null);
    }
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!imageUrl || !selectedCoin) return;

    const finalCoinName = suggestedMeme || selectedCoin;
    addMemePhoto(finalCoinName, imageUrl, tags);

    // Reset form
    setImageUrl('');
    setSelectedCoin('');
    setTags([]);
    setTagInput('');
    setSuggestedMeme(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - 3 columns */}
        <div className="lg:col-span-3">
          {/* Submit Form */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Submit a Meme</h2>
            
            {/* Image Upload Area */}
            <div
              className="border-2 border-dashed border-gray-700 rounded-lg p-6 mb-4 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {imageUrl ? (
                <div className="space-y-4">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded"
                  />
                  <button
                    onClick={() => setImageUrl('')}
                    className="text-blue-400 text-sm hover:text-blue-300"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Drag and drop or paste URL
                    </p>
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      className="w-full bg-gray-700 p-2 rounded mb-2"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">- or -</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Coin Selection */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Enter memecoin name (e.g. $PEPE)"
                className="w-full bg-gray-700 p-2 rounded"
                value={selectedCoin}
                onChange={(e) => handleCoinInput(e.target.value)}
              />
              {suggestedMeme && (
                <div 
                  className="absolute w-full bg-gray-700 mt-1 rounded p-2 cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setSelectedCoin(suggestedMeme);
                    setSuggestedMeme(null);
                  }}
                >
                  {suggestedMeme}
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Hash size={16} className="mr-2" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="ml-2"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (press Enter)"
                className="w-full bg-gray-700 p-2 rounded"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInput}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center"
              disabled={!imageUrl || !selectedCoin}
            >
              <ImageIcon className="mr-2" />
              Submit Meme
            </button>
          </div>

          {/* Recent Submissions */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...memePhotos].reverse().slice(0, 9).map((photo) => (
                <div key={photo.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.coinName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{photo.coinName}</h3>
                      <div className="flex items-center space-x-4">
                        <button 
                          className="text-gray-400 hover:text-green-400"
                          onClick={() => voteMemePhoto(photo.id, true)}
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <span>{photo.points}</span>
                        <button 
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => voteMemePhoto(photo.id, false)}
                        >
                          <ThumbsDown size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <User size={14} className="mr-1" />
                      {photo.submittedBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Trophy className="text-yellow-400 mr-2" />
              Top Meme Photos
            </h2>
            <div className="space-y-4">
              {topMemePhotos.map((photo, index) => (
                <div key={photo.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.coinName}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400">#{index + 1}</span>
                      <span>{photo.points} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeWars;