import { MemeSubmission } from '../types';
import { orderBy } from 'lodash';

export const getTopMemes = (memes: MemeSubmission[], limit: number = 10): MemeSubmission[] => {
  return orderBy(memes, [(meme) => meme.upvotes - meme.downvotes], ['desc']).slice(0, limit);
};

export const calculatePoints = (upvotes: number, downvotes: number): number => {
  return upvotes - downvotes;
};

export const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};