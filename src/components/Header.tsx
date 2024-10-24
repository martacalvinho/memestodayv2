import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Sword, Image, Crosshair, Zap, Wallet } from 'lucide-react';
import { useMemeStore } from '../store/MemeStore';

const Header: React.FC = () => {
  const { currentUser } = useMemeStore();
  const location = useLocation();

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Rocket className="text-yellow-400 mr-2" />
            <h1 className="text-2xl font-bold">MemesToday</h1>
          </Link>

          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/battle-royale" 
                  className={`flex items-center hover:text-yellow-400 ${
                    location.pathname === '/battle-royale' ? 'text-yellow-400' : ''
                  }`}
                >
                  <Sword className="mr-1" size={18} />
                  Battle Royale
                </Link>
              </li>
              <li>
                <Link 
                  to="/meme-wars" 
                  className={`flex items-center hover:text-yellow-400 ${
                    location.pathname === '/meme-wars' ? 'text-yellow-400' : ''
                  }`}
                >
                  <Image className="mr-1" size={18} />
                  Meme Wars
                </Link>
              </li>
              <li>
                <Link 
                  to="/bounty-hunts" 
                  className={`flex items-center hover:text-yellow-400 ${
                    location.pathname === '/bounty-hunts' ? 'text-yellow-400' : ''
                  }`}
                >
                  <Crosshair className="mr-1" size={18} />
                  Bounty Hunts
                </Link>
              </li>
              <li>
                <Link 
                  to="/flash-challenges" 
                  className={`flex items-center hover:text-yellow-400 ${
                    location.pathname === '/flash-challenges' ? 'text-yellow-400' : ''
                  }`}
                >
                  <Zap className="mr-1" size={18} />
                  Flash Challenges
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <Link 
                to={`/profile/${currentUser.id}`}
                className="text-sm hover:text-yellow-400 flex items-center"
              >
                <span className="mr-2">{currentUser.name}</span>
                <span className="text-yellow-400">🔥 {currentUser.streak} day streak</span>
              </Link>
            )}
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg flex items-center">
              <Wallet className="mr-2" size={18} />
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;