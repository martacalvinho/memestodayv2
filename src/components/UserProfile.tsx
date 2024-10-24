import React, { useState } from 'react';
import { User, Meme } from '../types';
import { Edit2, Save, UserPlus, UserMinus, Trophy, Target, Zap, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowModal from './FollowModal';

interface UserProfileProps {
  user: User | null;
  allUsers: User[];
  allMemes: Meme[];
  onFollowUser: (userId: number) => void;
  onUnfollowUser: (userId: number) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, allUsers, allMemes, onFollowUser, onUnfollowUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.name || '');
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [followedCoinsModalOpen, setFollowedCoinsModalOpen] = useState(false);

  if (!user) return null;

  const handleUsernameChange = () => {
    if (isEditing) {
      // Update user name logic here
      // setUser({ ...user, name: editedUsername });
    }
    setIsEditing(!isEditing);
  };

  const handleUnfollowCoin = (coinId: string) => {
    // Implement unfollow coin logic
    console.log('Unfollowing coin:', coinId);
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Streak</h3>
        <p className="text-2xl font-bold">{user.streak} days</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Total Submissions</h3>
        <p className="text-2xl font-bold">{user.totalSubmissions}</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Liked Memes</h3>
        <p className="text-2xl font-bold">{user.likedMemes.length}</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Battle Royale Points</h3>
        <p className="text-2xl font-bold">{user.battleRoyalePoints || 0}</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Bounty Hunt Features</h3>
        <p className="text-2xl font-bold">{user.bountyHuntFeatures || 0}</p>
      </div>

      <div 
        className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer"
        onClick={() => setFollowedCoinsModalOpen(true)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2">Followed Coins</h3>
          <Star className="text-yellow-400" />
        </div>
        <p className="text-2xl font-bold">{user.followedCoins?.length || 0}</p>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Submitted Memes</h3>
      {user.submittedMemes.length > 0 ? (
        <ul className="space-y-2">
          {user.submittedMemes.map((memeId) => {
            const meme = allMemes.find(m => m.id === memeId);
            return (
              <li key={memeId} className="flex justify-between items-center">
                <Link 
                  to={`/meme/${encodeURIComponent(meme?.name || '')}`}
                  className="hover:text-blue-400"
                >
                  {meme ? meme.name : 'Unknown Meme'}
                </Link>
                {user.shillersPicks.includes(memeId) && (
                  <Award className="text-yellow-400" title="Shiller's Pick" />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No memes submitted yet.</p>
      )}
    </div>
  );

  const renderFollowers = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Followers</h3>
      {user.followers.length > 0 ? (
        <ul className="space-y-2">
          {user.followers.map((followerId) => {
            const follower = allUsers.find(u => u.id === followerId);
            return (
              <li key={followerId} className="flex justify-between items-center">
                <Link 
                  to={`/profile/${followerId}`}
                  className="hover:text-blue-400"
                >
                  {follower?.name || 'Unknown User'}
                </Link>
                {!user.following.includes(followerId) && (
                  <button
                    onClick={() => onFollowUser(followerId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center"
                  >
                    <UserPlus size={16} className="mr-1" /> Follow Back
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No followers yet.</p>
      )}
    </div>
  );

  const renderFollowing = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4 cursor-pointer" onClick={() => setIsFollowingModalOpen(true)}>
        Following ({user.following.length})
      </h3>
      {user.following.length > 0 ? (
        <ul className="space-y-2">
          {user.following.map((followingId) => {
            const following = allUsers.find(u => u.id === followingId);
            return (
              <li key={followingId} className="flex justify-between items-center">
                <Link 
                  to={`/profile/${followingId}`}
                  className="hover:text-blue-400"
                >
                  {following?.name || 'Unknown User'}
                </Link>
                <button
                  onClick={() => onUnfollowUser(followingId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center"
                >
                  <UserMinus size={16} className="mr-1" /> Unfollow
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Not following anyone yet.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {isEditing ? (
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            />
          ) : (
            user.name
          )}
        </h2>
        {user.id === 1 && ( // Assuming ID 1 is the local user
          <button
            onClick={handleUsernameChange}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded"
          >
            {isEditing ? (
              <>
                <Save className="mr-2" size={18} />
                Save
              </>
            ) : (
              <>
                <Edit2 className="mr-2" size={18} />
                Edit Username
              </>
            )}
          </button>
        )}
      </div>

      {renderStats()}
      {renderSubmissions()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {renderFollowers()}
        {renderFollowing()}
      </div>

      <FollowModal
        isOpen={followedCoinsModalOpen}
        onClose={() => setFollowedCoinsModalOpen(false)}
        title="Followed Coins"
        items={(user.followedCoins || []).map(coin => ({
          id: coin,
          name: coin
        }))}
        onUnfollow={handleUnfollowCoin}
        itemType="coin"
      />

      <FollowModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        title="Following"
        items={user.following.map(id => ({
          id: id.toString(),
          name: allUsers.find(u => u.id === id)?.name || 'Unknown User'
        }))}
        onUnfollow={(id) => onUnfollowUser(parseInt(id))}
        itemType="user"
      />
    </div>
  );
};

export default UserProfile;