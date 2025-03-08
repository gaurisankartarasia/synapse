// app/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { FollowRequest } from './components/FollowRequest';
import { Spinner } from '@/components/ui/spinner';

interface NotificationData {
  id: string;
  timestamp: any;
  user: {
    uid: string;
    username: string;
    profilePhotoURL: string;
    displayName: string;
    isVerified:boolean;
    isPrivate:boolean
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
       credentials:'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.followRequests);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="flex justify-center"> <Spinner/> </div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="p-4 text-2xl font-bold">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="p-4 t500">No new notifications</div>
      ) : (
        <div className="divide-y">
           <b>Pending requests  </b>
          {notifications.map((notification) => (
            <FollowRequest
              key={notification.id}
              user={notification.user}
              onActionComplete={fetchNotifications}
            />
          ))}
        </div>
      )}
    </div>
  );
}







