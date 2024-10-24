import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User as UserIcon, Award, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Meme, User } from '../types';
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

interface MemeGridProps {
  memes: Meme[];
  onLike: (memeId: number) => void;
  userLikes: number[];
  onViewProfile: (userId: number) => void;
  users: User[];
}

const MemeGrid: React.FC<MemeGridProps> = ({ memes, onLike, userLikes, onViewProfile, users }) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleCard = (memeId: number) => {
    setFlippedCards(prev => 
      prev.includes(memeId) ? prev.filter(id => id !== memeId) : [...prev, memeId]
    );
  };

  const renderPopularityGraph = (meme: Meme) => {
    const data = {
      labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d', 'Now'],
      datasets: [
        {
          label: 'Popularity',
          data: meme.popularityHistory || [0, 0, 0, 0, 0, 0, 0, meme.submissionCount],
          borderColor: '#60A5FA',
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          tension: 0.4
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#9CA3AF',
            display: false
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 10
            }
          }
        }
      }
    };

    return (
      <div className="h-24">
        <Line data={data} options={options} />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
      {memes.map((meme) => {
        const submitter = users.find(user => user.id === meme.firstSubmitter);
        const isFlipped = flippedCards.includes(meme.id);
        
        return (
          <div 
            key={meme.id} 
            className={`bg-gray-800 rounded-lg transition-all duration-300 cursor-pointer ${
              isFlipped ? 'h-[320px]' : 'h-[120px]'
            }`}
            onClick={() => toggleCard(meme.id)}
          >
            <div className="p-4">
              <Link 
                to={`/meme/${encodeURIComponent(meme.name)}`}
                className="text-xl font-bold mb-2 hover:text-blue-400"
                onClick={(e) => e.stopPropagation()}
              >
                {meme.name}
              </Link>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-400 font-semibold">
                  x{meme.submissionCount}
                </span>
                <button 
                  className={`flex items-center ${userLikes.includes(meme.id) ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-400`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(meme.id);
                  }}
                >
                  <Heart className="mr-1" size={16} />
                  {meme.likes}
                </button>
              </div>

              <div 
                className="text-sm text-blue-400 flex items-center hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile(meme.firstSubmitter);
                }}
              >
                <UserIcon className="mr-1" size={14} />
                First submitted by: {submitter?.name || 'Unknown'}
              </div>

              {isFlipped && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-sm font-semibold mb-2">Stats</h3>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center">
                      <Award className="mr-2" size={14} />
                      Shiller's Pick: {meme.shillersPickCount} times
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="mr-2" size={14} />
                      Popularity Trend
                    </li>
                  </ul>
                  {renderPopularityGraph(meme)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MemeGrid;