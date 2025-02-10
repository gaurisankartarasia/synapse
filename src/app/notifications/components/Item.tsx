// components/NotificationItem.tsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'follow_request' | 'new_follower';
    fromUid: string;
    fromUsername: string;
    fromdisplayName: string;
    fromprofilePhotoURL: string;
    timestamp: any;
  };
  onActionComplete?: () => void;
}

export const NotificationItem = ({ notification, onActionComplete }: NotificationItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'accept' | 'reject') => {
    if (notification.type !== 'follow_request') return;
    
    setIsLoading(true);
    try {
      
      const response = await fetch('/api/handle-follow-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({
          fromUid: notification.fromUid,
          action
        })
      });

      if (!response.ok) {
        throw new Error('Failed to handle follow request');
      }

      onActionComplete?.();
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
          src={notification.fromprofilePhotoURL || '/default-avatar.png'}
          alt={notification.fromUsername}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <Link href={`/${notification.fromUsername}`} className="hover:underline">
            <span className="font-semibold">{notification.fromdisplayName}</span>
          </Link>
          {notification.type === 'new_follower' ? (
            <p className="text-sm text-gray-600">started following you</p>
          ) : (
            <p className="text-sm text-gray-600">requested to follow you</p>
          )}
          <p className="text-xs text-gray-400">
            {new Date(notification.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {notification.type === 'follow_request' && (
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
      )}
    </div>
  );
};