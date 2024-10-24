import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meme, User, MemeSubmission } from '../types';

interface MemeState {
  memes: Meme[];
  users: User[];
  currentUser: User | null;
  memePhotos: MemeSubmission[];
  userLikes: { userId: number; memeId: number }[];
  userSubmissions: { userId: number; memeId: number; date: string }[];
  shillersPicks: { memeId: number; date: string }[];
  battleRoyaleWins: { memeId: number; date: string; position: number }[];
  
  // Actions
  addMeme: (memeName: string, userId: number) => void;
  updateMemeSubmissionCount: (memeName: string) => void;
  addMemePhoto: (memeName: string, imageUrl: string, userId: number, tags: string[]) => void;
  voteMemePhoto: (photoId: string, userId: number, isUpvote: boolean) => void;
  likeMeme: (memeId: number, userId: number) => void;
  unlikeMeme: (memeId: number, userId: number) => void;
  findSimilarMeme: (input: string) => Meme | null;
  getMemeByName: (name: string) => Meme | null;
  getTopMemes: () => Meme[];
  getTopMemePhotos: () => MemeSubmission[];
  getMemePhotosForMeme: (memeName: string) => MemeSubmission[];
}

const initialMemes: Meme[] = [
  {
    id: 1,
    name: '$PEPE',
    submissionCount: 4,
    likes: 10,
    firstSubmitter: 1,
    shillersPickCount: 2,
    popularityHistory: [1, 2, 3, 2, 4, 3, 4, 4],
    submissionDate: '2024-02-15T00:00:00.000Z'
  },
  {
    id: 2,
    name: '$DOGE',
    submissionCount: 2,
    likes: 5,
    firstSubmitter: 2,
    shillersPickCount: 1,
    popularityHistory: [0, 1, 1, 2, 1, 2, 2, 2],
    submissionDate: '2024-02-16T00:00:00.000Z'
  }
];

const initialUsers: User[] = [
  {
    id: 1,
    name: 'CryptoEnthusiast',
    streak: 3,
    totalSubmissions: 4,
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
    totalSubmissions: 2,
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

export const useMemeStore = create<MemeState>()(
  persist(
    (set, get) => ({
      memes: initialMemes,
      users: initialUsers,
      currentUser: initialUsers[0],
      memePhotos: [],
      userLikes: [],
      userSubmissions: [],
      shillersPicks: [],
      battleRoyaleWins: [],

      addMeme: (memeName: string, userId: number) => {
        if (!memeName) return;

        const similarMeme = get().findSimilarMeme(memeName);
        if (similarMeme) {
          get().updateMemeSubmissionCount(similarMeme.name);
          return;
        }

        const formattedName = memeName.startsWith('$') ? memeName : `$${memeName.toUpperCase()}`;
        const newMeme: Meme = {
          id: get().memes.length + 1,
          name: formattedName,
          submissionCount: 1,
          likes: 0,
          firstSubmitter: userId,
          shillersPickCount: 0,
          popularityHistory: [0, 0, 0, 0, 0, 0, 0, 1],
          submissionDate: new Date().toISOString()
        };

        set(state => ({
          memes: [...state.memes, newMeme]
        }));
      },

      updateMemeSubmissionCount: (memeName: string) => {
        if (!memeName) return;
        
        set(state => ({
          memes: state.memes.map(meme =>
            meme.name === memeName
              ? { ...meme, submissionCount: meme.submissionCount + 1 }
              : meme
          )
        }));
      },

      addMemePhoto: (memeName: string, imageUrl: string, userId: number, tags: string[]) => {
        if (!memeName || !imageUrl) return;

        const newPhoto: MemeSubmission = {
          id: Date.now().toString(),
          coinName: memeName,
          imageUrl,
          points: 0,
          submittedBy: get().users.find(u => u.id === userId)?.name || 'Anonymous',
          timestamp: new Date(),
          tags
        };

        set(state => ({
          memePhotos: [...state.memePhotos, newPhoto]
        }));
      },

      voteMemePhoto: (photoId: string, userId: number, isUpvote: boolean) => {
        set(state => ({
          memePhotos: state.memePhotos.map(photo =>
            photo.id === photoId
              ? { ...photo, points: photo.points + (isUpvote ? 1 : -1) }
              : photo
          )
        }));
      },

      likeMeme: (memeId: number, userId: number) => {
        set(state => ({
          userLikes: [...state.userLikes, { userId, memeId }],
          memes: state.memes.map(meme =>
            meme.id === memeId
              ? { ...meme, likes: meme.likes + 1 }
              : meme
          )
        }));
      },

      unlikeMeme: (memeId: number, userId: number) => {
        set(state => ({
          userLikes: state.userLikes.filter(like => 
            !(like.userId === userId && like.memeId === memeId)
          ),
          memes: state.memes.map(meme =>
            meme.id === memeId
              ? { ...meme, likes: Math.max(0, meme.likes - 1) }
              : meme
          )
        }));
      },

      findSimilarMeme: (input: string) => {
        if (!input?.trim()) return null;
        
        const normalizedInput = input.toLowerCase().replace('$', '').trim();
        return get().memes.find(meme => {
          const memeName = meme.name.toLowerCase().replace('$', '').trim();
          return memeName === normalizedInput || memeName.includes(normalizedInput);
        }) || null;
      },

      getMemeByName: (name: string) => {
        if (!name) return null;
        return get().memes.find(meme => meme.name === name) || null;
      },

      getTopMemes: () => {
        return [...get().memes]
          .sort((a, b) => b.submissionCount - a.submissionCount)
          .slice(0, 10);
      },

      getTopMemePhotos: () => {
        return [...get().memePhotos]
          .sort((a, b) => b.points - a.points)
          .slice(0, 10);
      },

      getMemePhotosForMeme: (memeName: string) => {
        if (!memeName) return [];
        return get().memePhotos.filter(photo => photo.coinName === memeName);
      }
    }),
    {
      name: 'meme-storage',
      version: 1
    }
  )
);