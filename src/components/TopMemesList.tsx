import React, { useState } from 'react';
import { Trophy, User } from 'lucide-react';
import { MemeSubmission } from '../types';
import MemePopup from './MemePopup';

interface TopMemesListProps {
  memes: MemeSubmission[];
  className?: string;
}

const TopMemesList: React.FC<TopMemesListProps> = ({ memes, className = '' }) => {
  const [selectedMeme, setSelectedMeme] = useState<MemeSubmission | null>(null);

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="text-yellow-400 mr-2" />
        Top 10 Memes
      </h2>
      <div className="space-y-4">
        {memes.map((meme, index) => (
          <div 
            key={meme.id} 
            className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => setSelectedMeme(meme)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400 font-bold min-w-[2rem]">#{index + 1}</span>
              <div className="h-12 w-12 flex-shrink-0">
                <img
                  src={meme.imageUrl}
                  alt={meme.coinName}
                  className="h-full w-full object-cover rounded"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium truncate">{meme.coinName}</div>
                <div className="flex items-center text-sm text-gray-400">
                  <User size={12} className="mr-1" />
                  <span className="truncate">{meme.submittedBy}</span>
                </div>
              </div>
              <div className="text-gray-400 flex-shrink-0">
                {meme.upvotes - meme.downvotes} points
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMeme && (
        <MemePopup 
          meme={selectedMeme} 
          onClose={() => setSelectedMeme(null)} 
        />
      )}
    </div>
  );
};

export default TopMemesList;