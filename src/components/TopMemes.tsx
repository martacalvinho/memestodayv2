import React, { useState } from 'react';
import { Trophy, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemeStore } from '../store/MemeStore';

const TopMemes: React.FC = () => {
  const [showMemePhotos, setShowMemePhotos] = useState(false);
  const { getTopMemes, getTopMemePhotos, users } = useMemeStore();

  const topMemes = getTopMemes();
  const topMemePhotos = getTopMemePhotos();

  const renderMemePhoto = (submission: any, index: number) => (
    <div 
      key={`photo-${submission.id}-${index}`} 
      className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <span className="text-yellow-400">#{index + 1}</span>
        <img 
          src={submission.imageUrl} 
          alt={submission.coinName} 
          className="w-16 h-16 object-cover rounded" 
        />
        <div>
          <Link 
            to={`/meme/${encodeURIComponent(submission.coinName)}`} 
            className="font-bold hover:text-blue-400"
          >
            {submission.coinName}
          </Link>
          <div className="text-sm text-gray-400">by {submission.submittedBy}</div>
        </div>
      </div>
      <div className="text-lg font-bold">
        {submission.upvotes - submission.downvotes} points
      </div>
    </div>
  );

  const renderMeme = (meme: any, index: number) => (
    <div 
      key={`meme-${meme.id}-${index}`} 
      className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
    >
      <div>
        <span className="text-yellow-400 mr-2">#{index + 1}</span>
        <Link 
          to={`/meme/${encodeURIComponent(meme.name)}`} 
          className="font-bold hover:text-blue-400"
        >
          {meme.name}
        </Link>
        <div className="text-sm text-gray-400">
          First submitted by: {users.find(u => u.id === meme.firstSubmitter)?.name}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          {meme.submissionCount} submissions
        </div>
        <div className="flex items-center text-blue-400">
          <ThumbsUp className="mr-1" size={16} />
          {meme.likes}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 my-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Trophy className="text-yellow-400 mr-2" />
          <h2 className="text-2xl font-bold">Top 10 {showMemePhotos ? 'Meme Photos' : 'Memes'}</h2>
        </div>
        <button
          onClick={() => setShowMemePhotos(!showMemePhotos)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Switch to {showMemePhotos ? 'Memes' : 'Meme Photos'}
        </button>
      </div>

      <div className="space-y-4">
        {showMemePhotos 
          ? topMemePhotos.map((submission, index) => renderMemePhoto(submission, index))
          : topMemes.map((meme, index) => renderMeme(meme, index))
        }
      </div>
    </div>
  );
};

export default TopMemes;