import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Calendar, 
  Users,
  UserPlus,
  UserMinus,
  Share2,
  Star
} from 'lucide-react';
import { useMemeStore } from '../store/MemeStore';
import FollowModal from './FollowModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MemeProfile: React.FC = () => {
  const { coinName } = useParams<{ coinName: string }>();
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const { 
    currentUser, 
    getMemePhotosForMeme,
    getMemeByName
  } = useMemeStore();

  const decodedCoinName = coinName ? decodeURIComponent(coinName) : '';
  const meme = decodedCoinName ? getMemeByName(decodedCoinName) : null;
  const memePhotos = meme ? getMemePhotosForMeme(meme.name) : [];
  
  useEffect(() => {
    if (currentUser?.followedCoins && meme?.name) {
      setIsFollowing(currentUser.followedCoins.includes(meme.name));
    }
  }, [currentUser, meme]);

  if (!meme) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold">Meme not found</h1>
          <p className="text-gray-400 mt-2">The requested meme could not be found.</p>
        </div>
      </div>
    );
  }

  const stats = {
    followers: 316,
    battleRoyaleWins: meme.popularityHistory[meme.popularityHistory.length - 1],
    shillersPicks: meme.shillersPickCount || 0,
    topTenAppearances: 3
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    const tweetText = `Check out ${meme.name} on MemesToday! #MemesToday #Crypto`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const chartData = {
    labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [{
      label: 'Popularity',
      data: meme.popularityHistory || [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{meme.name}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFollowToggle}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isFollowing
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="mr-2" size={18} />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Follow
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg"
            >
              <Share2 className="mr-2" size={18} />
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center text-yellow-400 mb-2">
              <Trophy className="mr-2" size={18} />
              Battle Royale Wins
            </div>
            <div className="text-2xl font-bold">{stats.battleRoyaleWins}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center text-blue-400 mb-2">
              <Award className="mr-2" size={18} />
              Shiller's Picks
            </div>
            <div className="text-2xl font-bold">{stats.shillersPicks}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center text-green-400 mb-2">
              <Star className="mr-2" size={18} />
              Top 10 Appearances
            </div>
            <div className="text-2xl font-bold">{stats.topTenAppearances}</div>
          </div>
          <div 
            className="bg-gray-700 p-4 rounded-lg cursor-pointer"
            onClick={() => setIsFollowersModalOpen(true)}
          >
            <div className="flex items-center text-purple-400 mb-2">
              <Users className="mr-2" size={18} />
              Followers
            </div>
            <div className="text-2xl font-bold">{stats.followers}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2" />
          Popularity Trend
        </h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Meme Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memePhotos.map((photo) => (
            <div key={photo.id} className="bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.coinName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{photo.points} points</span>
                  <span className="text-sm text-gray-400">
                    {new Date(photo.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FollowModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        title="Followers"
        items={[
          { id: '1', name: 'CryptoEnthusiast' },
          { id: '2', name: 'MemeQueen' }
        ]}
        onUnfollow={() => {}}
        itemType="user"
      />
    </div>
  );
};

export default MemeProfile;