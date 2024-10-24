export interface Meme {
  id: number;
  name: string;
  submissionCount: number;
  likes: number;
  firstSubmitter: number;
  shillersPickCount: number;
  popularityHistory: number[];
  submissionDate: string;
}

export interface User {
  id: number;
  name: string;
  streak: number;
  totalSubmissions: number;
  likedMemes: number[];
  submittedMemes: number[];
  shillersPicks: number[];
  followers: number[];
  following: number[];
  battleRoyalePoints?: number;
  bountyHuntFeatures?: number;
  flashChallengePoints?: number;
  followedCoins?: string[];
}

export interface MemeSubmission {
  id: string;
  coinName: string;
  imageUrl: string;
  points: number;
  submittedBy: string;
  timestamp: Date;
  tags: string[];
}

export interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: { id: string; name: string }[];
  onUnfollow: (id: string) => void;
  itemType: 'user' | 'coin';
}