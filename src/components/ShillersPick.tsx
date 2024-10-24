import React, { useState } from 'react';
import { Twitter, Calendar } from 'lucide-react';
import { useMemeStore } from '../store/MemeStore';

const ShillersPick: React.FC = () => {
  const { memes } = useMemeStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const topMeme = memes.length > 0
    ? memes.reduce((prev, current) => 
        ((current.upvotes - current.downvotes) > (prev.upvotes - prev.downvotes)) ? current : prev
      )
    : null;

  const handleShare = () => {
    if (!topMeme) return;
    
    const tweetText = `Check out ${topMeme.coinName}, the top memecoin on MemesToday! #MemesToday #Crypto`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Shiller's Pick</h2>
        <div className="flex items-center">
          <Calendar className="mr-2" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded-md"
          />
        </div>
      </div>
      {topMeme ? (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{topMeme.coinName}</h3>
            <p className="text-gray-400">Score: {topMeme.upvotes - topMeme.downvotes}</p>
          </div>
          <button
            onClick={handleShare}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <Twitter className="mr-2" size={16} />
            Share on Twitter
          </button>
        </div>
      ) : (
        <p>No memes submitted yet. Be the first to submit!</p>
      )}
    </div>
  );
};

export default ShillersPick;