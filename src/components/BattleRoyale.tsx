import React, { useState, useEffect } from 'react';
import { Meme, User } from '../types';
import { Sword, Trophy, Clock, Twitter, Calendar, Users, AlertTriangle } from 'lucide-react';

interface BattleRoyaleProps {
  memes: Meme[];
  users: User[];
  currentUser: User | null;
}

interface Match {
  id: number;
  round: number;
  coin1: string;
  coin2: string;
  votes1: number;
  votes2: number;
  winner: string | null;
}

const BattleRoyale: React.FC<BattleRoyaleProps> = ({ memes, users, currentUser }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState('');
  const [userPoints, setUserPoints] = useState(130);
  const [hasVoted, setHasVoted] = useState(false);
  const [tournamentStart] = useState(new Date());
  
  const [matches, setMatches] = useState<Match[]>([
    // Quarter Finals (Round 1)
    { id: 1, round: 1, coin1: '$DOGE', coin2: '$SHIB', votes1: 1201, votes2: 800, winner: null },
    { id: 2, round: 1, coin1: '$PEPE', coin2: '$FLOKI', votes1: 950, votes2: 1100, winner: null },
    { id: 3, round: 1, coin1: '$BONK', coin2: '$WOJAK', votes1: 1500, votes2: 700, winner: null },
    { id: 4, round: 1, coin1: '$SAMO', coin2: '$HOGE', votes1: 600, votes2: 900, winner: null },
    // Semi Finals (Round 2)
    { id: 5, round: 2, coin1: '?', coin2: '?', votes1: 0, votes2: 0, winner: null },
    { id: 6, round: 2, coin1: '?', coin2: '?', votes1: 0, votes2: 0, winner: null },
    // Finals (Round 3)
    { id: 7, round: 3, coin1: '?', coin2: '?', votes1: 0, votes2: 0, winner: null }
  ]);

  const [previousWinners] = useState([
    { name: '$PEPE', date: '2024-02-25', votes: 2500 },
    { name: '$DOGE', date: '2024-02-18', votes: 2100 },
    { name: '$SHIB', date: '2024-02-11', votes: 1900 },
    { name: '$FLOKI', date: '2024-02-04', votes: 1800 },
    { name: '$BONK', date: '2024-01-28', votes: 2300 },
  ]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const roundTimes = {
        1: { start: '09:00', end: '21:00' }, // Saturday 9 AM - 9 PM
        2: { start: '21:00', end: '09:00' }, // Saturday 9 PM - Sunday 9 AM
        3: { start: '09:00', end: '21:00' }  // Sunday 9 AM - 9 PM
      };

      const now = new Date();
      const roundEnd = new Date(now);
      const [endHour, endMinute] = roundTimes[currentRound].end.split(':');
      roundEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      if (roundEnd < now) {
        roundEnd.setDate(roundEnd.getDate() + 1);
      }

      const difference = roundEnd - now;
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
      }
      
      return 'Round Ending...';
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound]);

  const getCurrentMatch = () => {
    return matches.find(match => match.round === currentRound && !match.winner);
  };

  const handleVote = (coinNumber: number) => {
    if (hasVoted) return;
    
    const currentMatch = getCurrentMatch();
    if (!currentMatch) return;
    
    const updatedMatches = matches.map(match => {
      if (match.id === currentMatch.id) {
        return {
          ...match,
          votes1: coinNumber === 1 ? match.votes1 + 1 : match.votes1,
          votes2: coinNumber === 2 ? match.votes2 + 1 : match.votes2
        };
      }
      return match;
    });
    
    setMatches(updatedMatches);
    setHasVoted(true);
    setUserPoints(userPoints + 10);
  };

  const handleShare = (coinName: string) => {
    const tweetText = `I'm voting for ${coinName} in Round ${currentRound} of the MemesToday Battle Royale! Join the tournament and support your favorite memecoin! 🏆 #MemesToday #Crypto`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const currentMatch = getCurrentMatch();
  const totalVotes = currentMatch ? currentMatch.votes1 + currentMatch.votes2 : 0;
  const vote1Percentage = currentMatch ? ((currentMatch.votes1 / totalVotes) * 100).toFixed(1) : 0;
  const vote2Percentage = currentMatch ? ((currentMatch.votes2 / totalVotes) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Current Battle Display */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Round {currentRound} - Current Battle 🏆</h2>
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{timeLeft}</span>
          </div>
          
          <div className="flex items-center justify-between px-8">
            <div className="flex-1 bg-gray-700 p-4 rounded-lg">
              <div className="text-xl font-bold mb-2">{currentMatch?.coin1}</div>
              <div className="text-lg font-semibold">{vote1Percentage}%</div>
              <div className="text-sm text-gray-400">{currentMatch?.votes1} votes</div>
              <button 
                onClick={() => handleVote(1)}
                disabled={hasVoted}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 disabled:opacity-50"
              >
                Vote
              </button>
              <button
                onClick={() => handleShare(currentMatch?.coin1 || '')}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded mt-2 flex items-center justify-center"
              >
                <Twitter className="w-4 h-4 mr-2" /> Share
              </button>
            </div>
            
            <div className="text-2xl font-bold px-8">VS</div>
            
            <div className="flex-1 bg-gray-700 p-4 rounded-lg">
              <div className="text-xl font-bold mb-2">{currentMatch?.coin2}</div>
              <div className="text-lg font-semibold">{vote2Percentage}%</div>
              <div className="text-sm text-gray-400">{currentMatch?.votes2} votes</div>
              <button 
                onClick={() => handleVote(2)}
                disabled={hasVoted}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 disabled:opacity-50"
              >
                Vote
              </button>
              <button
                onClick={() => handleShare(currentMatch?.coin2 || '')}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded mt-2 flex items-center justify-center"
              >
                <Twitter className="w-4 h-4 mr-2" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold">Your Points: {userPoints}</div>
        <div className="text-sm text-gray-400">
          Vote correctly to earn more points!
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Tournament started: {tournamentStart.toLocaleDateString()}
        </div>
        <div className="flex items-center text-yellow-400">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Tournament ends in {timeLeft}
        </div>
      </div>

      {/* Tournament Bracket */}
      <div className="relative" style={{ height: '600px' }}>
        {/* Round 1 - Quarter Finals */}
        <div className="absolute left-0 w-64 flex flex-col justify-between" style={{ height: '500px' }}>
          {matches.slice(0, 4).map((match, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3">
              <div className="border-b border-gray-600 pb-2">{match.coin1}</div>
              <div className="pt-2">{match.coin2}</div>
            </div>
          ))}
        </div>

        {/* Connecting Lines */}
        <svg className="absolute left-64 top-0" style={{ height: '500px', width: '100px' }}>
          <path d="M 0 60 H 30 V 140 H 100" stroke="#4B5563" fill="none" />
          <path d="M 0 180 H 30 V 140 H 100" stroke="#4B5563" fill="none" />
          <path d="M 0 320 H 30 V 380 H 100" stroke="#4B5563" fill="none" />
          <path d="M 0 440 H 30 V 380 H 100" stroke="#4B5563" fill="none" />
        </svg>

        {/* Round 2 - Semi Finals */}
        <div className="absolute left-96 w-64" style={{ top: '120px', height: '300px' }}>
          <div className="flex flex-col justify-between h-full">
            {matches.slice(4, 6).map((match, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <div className="border-b border-gray-600 pb-2">{match.coin1}</div>
                <div className="pt-2">{match.coin2}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Connecting Lines to Finals */}
        <svg className="absolute" style={{ left: 'calc(384px + 256px)', top: '120px', height: '300px', width: '100px' }}>
          <path d="M 0 60 H 30 V 140 H 100" stroke="#4B5563" fill="none" />
          <path d="M 0 240 H 30 V 140 H 100" stroke="#4B5563" fill="none" />
        </svg>

        {/* Finals */}
        <div className="absolute" style={{ left: 'calc(384px + 256px + 100px)', top: '220px' }}>
          <div className="bg-gray-700 rounded-lg p-3 w-64">
            <div className="border-b border-gray-600 pb-2">{matches[6].coin1}</div>
            <div className="pt-2">{matches[6].coin2}</div>
          </div>
        </div>
      </div>

      {/* Previous Winners */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Trophy className="text-yellow-400 mr-2" />
          Previous Tournament Winners
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {previousWinners.map((winner, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold">{winner.name}</div>
                <div className="text-sm text-gray-400">{new Date(winner.date).toLocaleDateString()}</div>
              </div>
              <div className="text-yellow-400">
                {winner.votes.toLocaleString()} votes
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleRoyale;