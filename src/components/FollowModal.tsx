import React from 'react';
import { X, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FollowModalProps } from '../types';

const FollowModal: React.FC<FollowModalProps> = ({
  isOpen,
  onClose,
  title,
  items,
  onUnfollow,
  itemType
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item) => (
              <li 
                key={item.id} 
                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
              >
                <Link
                  to={`/${itemType}/${encodeURIComponent(item.name)}`}
                  className="hover:text-blue-400"
                >
                  {item.name}
                </Link>
                <button
                  onClick={() => onUnfollow(item.id)}
                  className="flex items-center text-red-400 hover:text-red-300"
                >
                  <UserMinus size={18} className="mr-1" />
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Not following any {itemType}s yet.</p>
        )}
      </div>
    </div>
  );
};

export default FollowModal;