import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MemeGrid from './components/MemeGrid';
import ShillersPick from './components/ShillersPick';
import SubmissionForm from './components/SubmissionForm';
import TopMemes from './components/TopMemes';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import BattleRoyale from './components/BattleRoyale';
import MemeWars from './components/MemeWars';
import BountyHunts from './components/BountyHunts';
import FlashChallenges from './components/FlashChallenges';
import MemeProfile from './components/MemeProfile';
import { Meme, User } from './types';

const App: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [userLikes, setUserLikes] = useState<number[]>([]);
  const [submittedMemes, setSubmittedMemes] = useState<string[]>([]);

  useEffect(() => {
    // Load data from localStorage or initialize with mock data
    const storedMemes = localStorage.getItem('memes');
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');
    const storedUserLikes = localStorage.getItem('userLikes');
    const storedSubmittedMemes = localStorage.getItem('submittedMemes');

    if (storedMemes) setMemes(JSON.parse(storedMemes));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
    if (storedUserLikes) setUserLikes(JSON.parse(storedUserLikes));
    if (storedSubmittedMemes) setSubmittedMemes(JSON.parse(storedSubmittedMemes));

    if (!storedMemes || !storedUsers || !storedCurrentUser) {
      initializeMockData();
    }
  }, []);

  const initializeMockData = () => {
    const initialMemes: Meme[] = [
      {
        id: 1,
        name: '$PEPE',
        submissionCount: 4,
        likes: 10,
        firstSubmitter: 1,
        shillersPickCount: 2,
        popularityHistory: [1, 2, 3, 2, 4, 3, 4, 4],
        submissionDate: new Date().toISOString()
      },
      {
        id: 2,
        name: '$DOGE',
        submissionCount: 2,
        likes: 5,
        firstSubmitter: 2,
        shillersPickCount: 1,
        popularityHistory: [0, 1, 1, 2, 1, 2, 2, 2],
        submissionDate: new Date().toISOString()
      }
    ];

    const initialUsers: User[] = [
      {
        id: 1,
        name: 'CryptoEnthusiast',
        streak: 3,
        totalSubmissions: 1,
        likedMemes: [2],
        submittedMemes: [1],
        shillersPicks: [1],
        followers: [2],
        following: [],
        battleRoyalePoints: 50,
        bountyHuntFeatures: 2,
        flashChallengePoints: 30,
        followedCoins: ['$PEPE', '$DOGE']
      },
      {
        id: 2,
        name: 'MemeQueen',
        streak: 1,
        totalSubmissions: 1,
        likedMemes: [1],
        submittedMemes: [2],
        shillersPicks: [],
        followers: [],
        following: [1],
        battleRoyalePoints: 30,
        bountyHuntFeatures: 1,
        flashChallengePoints: 20,
        followedCoins: ['$DOGE']
      }
    ];

    setMemes(initialMemes);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);

    localStorage.setItem('memes', JSON.stringify(initialMemes));
    localStorage.setItem('users', JSON.stringify(initialUsers));
    localStorage.setItem('currentUser', JSON.stringify(initialUsers[0]));
  };

  const handleLike = (memeId: number) => {
    if (!userLikes.includes(memeId)) {
      const updatedLikes = [...userLikes, memeId];
      setUserLikes(updatedLikes);
      localStorage.setItem('userLikes', JSON.stringify(updatedLikes));

      const updatedMemes = memes.map(meme => 
        meme.id === memeId ? { ...meme, likes: (meme.likes || 0) + 1 } : meme
      );
      setMemes(updatedMemes);
      localStorage.setItem('memes', JSON.stringify(updatedMemes));
    }
  };

  const handleSubmit = (memeName: string) => {
    const newMeme: Meme = {
      id: memes.length + 1,
      name: memeName,
      submissionCount: 1,
      likes: 0,
      firstSubmitter: currentUser?.id || 1,
      shillersPickCount: 0,
      popularityHistory: [0, 0, 0, 0, 0, 0, 0, 1],
      submissionDate: new Date().toISOString()
    };

    const updatedMemes = [...memes, newMeme];
    setMemes(updatedMemes);
    localStorage.setItem('memes', JSON.stringify(updatedMemes));

    const updatedSubmittedMemes = [...submittedMemes, memeName];
    setSubmittedMemes(updatedSubmittedMemes);
    localStorage.setItem('submittedMemes', JSON.stringify(updatedSubmittedMemes));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        user={currentUser} 
        timeRemaining={timeRemaining} 
        onViewChange={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <>
              <SubmissionForm 
                onSubmit={handleSubmit}
                submittedMemes={submittedMemes}
                userSubmittedToday={submittedMemes.length > 0}
              />
              <MemeGrid 
                memes={memes} 
                onLike={handleLike}
                userLikes={userLikes}
                onViewProfile={() => {}}
                users={users}
              />
              <ShillersPick 
                memes={memes} 
                onDateChange={() => {}} 
              />
              <TopMemes />
              <Leaderboard />
            </>
          } />
          <Route 
            path="/battle-royale" 
            element={<BattleRoyale memes={memes} users={users} currentUser={currentUser} />} 
          />
          <Route path="/meme-wars" element={<MemeWars />} />
          <Route path="/bounty-hunts" element={<BountyHunts />} />
          <Route path="/flash-challenges" element={<FlashChallenges />} />
          <Route 
            path="/profile/:userId" 
            element={
              <UserProfile 
                user={currentUser}
                allUsers={users}
                allMemes={memes}
                onFollowUser={() => {}}
                onUnfollowUser={() => {}}
              />
            } 
          />
          <Route 
            path="/meme/:coinName" 
            element={
              <MemeProfile 
                memes={memes}
                users={users}
                currentUser={currentUser}
                onFollowCoin={() => {}}
                onUnfollowCoin={() => {}}
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;