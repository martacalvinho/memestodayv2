import React from 'react';
import { X, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { MemeSubmission } from '../types';
import { useMemeStore } from '../store/MemeStore';

interface MemePopupProps {
  meme: MemeSubmission;
  onClose: () => void;
}

const MemePopup: React.FC<MemePopupProps> = ({ meme, onClose }) => {
  const { vote, removeVote, getUserVote, currentUser } = useMemeStore();

  const handleVote = (voteType: 'up' | 'down') => {
    if (!currentUser) return;
    
    const currentVote = getUserVote(meme.id, currentUser.id);
    if (currentVote === voteType) {
      removeVote(meme.id, currentUser.id);
    } else {
      vote(meme.id, currentUser.id, voteType);
    }
  };

  const userVote = currentUser ? getUserVote(meme.id, currentUser.id) : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full bg-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
        >
          <X size={24} />
        </button>
        <div className="p-4">
          <img
            src={meme.imageUrl}
            alt={meme.coinName}
            className="max-h-[80vh] w-auto mx-auto object-contain"
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-bold">{meme.coinName}</h3>
              <div className="flex items-center text-gray-400">
                <User size={16} className="mr-1" />
                <span>{meme.submittedBy}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className={`flex items-center ${
                  userVote === 'up' 
                    ? 'text-green-400' 
                    : 'text-gray-400 hover:text-green-300'
                }`}
                onClick={() => handleVote('up')}
              >
                <ThumbsUp size={20} className="mr-1" />
              </button>
              <span className="text-gray-400">
                {meme.upvotes - meme.downvotes} points
              </span>
              <button 
                className={`flex items-center ${
                  userVote === 'down' 
                    ? 'text-red-400' 
                    : 'text-gray-400 hover:text-red-300'
                }`}
                onClick={() => handleVote('down')}
              >
                <ThumbsDown size={20} className="mr-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemePopup;