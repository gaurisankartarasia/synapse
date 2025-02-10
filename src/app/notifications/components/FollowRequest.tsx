// components/FollowRequest.tsx
import { useState } from 'react';
import Image from 'next/image';

interface User {
  uid: string;
  username: string;
  profilePhotoURL: string;
  displayName: string;
}

interface FollowRequestProps {
  user: User;
  onActionComplete: () => void;
}

export const FollowRequest = ({ user, onActionComplete }: FollowRequestProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'accept' | 'reject') => {
    setIsLoading(true);
    try {
      
      const response = await fetch('/api/handle-follow-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          fromUid: user.uid,
          action
        })
      });

      if (!response.ok) {
        throw new Error('Failed to handle follow request');
      }

      onActionComplete();
    } catch (error) {
      console.error('Error handling follow request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Image
          src={user.profilePhotoURL || '/default-avatar.png'}
          alt={user.username}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleAction('accept')}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
};