// // app/notifications/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { FollowRequest } from './components/FollowRequest';
// import  { Spinner } from '@/components/ui/spinner';  

// interface NotificationData {
//   id: string;
//   timestamp: any;
//   user: {
//     uid: string;
//     username: string;
//     profilePhotoURL: string;
//     displayName: string;
//     isVerified:boolean;
//     isPrivate:boolean
//   };
// }

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch('/api/notifications', {
//        credentials:'include'
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch notifications');
//       }

//       const data = await response.json();
//       setNotifications(data.followRequests);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       setError('Failed to load notifications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center"> <Spinner/> </div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="p-4 text-2xl font-bold">Notifications</h1>
//       {notifications.length === 0 ? (
//         <div className="p-4 t500">No new notifications</div>
//       ) : (
//         <div className="divide-y">
//            <b>Pending requests  </b>
//           {notifications.map((notification) => (
//             <FollowRequest
//               key={notification.id}
//               user={notification.user}
//               onActionComplete={fetchNotifications}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }







'use client';
import { useEffect, useState } from 'react';
import { FollowRequest } from './components/FollowRequest';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, UserPlus, User } from 'lucide-react';

interface UserData {
  uid: string;
  username: string;
  profilePhotoURL: string;
  displayName: string;
  isVerified: boolean;
  isPrivate?: boolean;
}

interface FollowRequestData {
  id: string;
  timestamp: any;
  user: UserData;
}

interface NotificationData {
  id: string;
  type: string;
  fromUid: string;
  fromUsername: string;
  fromDisplayName: string;
  fromProfilePhotoURL: string;
  timestamp: any;
  read: boolean;
}

// Component for rendering a notification
const Notification = ({ notification, onMarkAsRead }: { 
  notification: NotificationData, 
  onMarkAsRead: (id: string) => void 
}) => {
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={`p-4 flex items-center ${!notification.read ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <Link href={`/${notification.fromUsername}`}>
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image 
            src={notification.fromProfilePhotoURL || '/default-avatar.png'} 
            alt={notification.fromUsername} 
            width={48} 
            height={48} 
            className="object-cover"
          />
        </div>
      </Link>
      <div className="flex-1">
        <Link href={`/${notification.fromUsername}`}>
          <div className="flex items-center">
            <span className="font-semibold">{notification.fromDisplayName}</span>
            {notification.type === 'new_follower' && (
              <span className="ml-2 text-gray-600">started following you</span>
            )}
          </div>
          <div className="text-sm text-gray-500">@{notification.fromUsername}</div>
          <div className="text-xs text-gray-400">
            {formatTime(notification.timestamp)}
          </div>
        </Link>
      </div>
      <div className="ml-2">
        {notification.type === 'new_follower' && <User className="text-blue-500" size={20} />}
      </div>
    </div>
  );
};

// Tabs component
const Tabs = ({ 
  activeTab, 
  setActiveTab, 
  followRequestsCount, 
  notificationsCount 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  followRequestsCount: number,
  notificationsCount: number
}) => {
  return (
    <div className="flex border-b mb-4">
      <button 
        className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => setActiveTab('all')}
      >
        All
      </button>
      <button 
        className={`px-4 py-2 font-medium flex items-center ${activeTab === 'requests' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => setActiveTab('requests')}
      >
        Requests
        {followRequestsCount > 0 && (
          <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {followRequestsCount}
          </span>
        )}
      </button>
      <button 
        className={`px-4 py-2 font-medium flex items-center ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => setActiveTab('notifications')}
      >
        Notifications
        {notificationsCount > 0 && (
          <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {notificationsCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default function NotificationsPage() {
  const [followRequests, setFollowRequests] = useState<FollowRequestData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setFollowRequests(data.followRequests || []);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
      
      if (response.ok) {
        // Update local state to mark as read
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="p-4 text-2xl font-bold">Notifications</h1>
      
      <Tabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        followRequestsCount={followRequests.length}
        notificationsCount={unreadNotificationsCount}
      />
      
      {followRequests.length === 0 && notifications.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">No new notifications</div>
      ) : (
        <div className="divide-y">
          {/* Show follow requests when on 'all' or 'requests' tab */}
          {(activeTab === 'all' || activeTab === 'requests') && followRequests.length > 0 && (
            <div className="mb-4">
              <h2 className="px-4 pt-2 pb-1 font-semibold text-gray-700 flex items-center">
                <UserPlus size={18} className="mr-2" /> Follow Requests
              </h2>
              {followRequests.map((request) => (
                <FollowRequest
                  key={request.id}
                  user={request.user}
                  onActionComplete={fetchNotifications}
                />
              ))}
            </div>
          )}
          
          {/* Show notifications when on 'all' or 'notifications' tab */}
          {(activeTab === 'all' || activeTab === 'notifications') && (
            <div>
              {activeTab === 'all' && notifications.length > 0 && (
                <h2 className="px-4 pt-2 pb-1 font-semibold text-gray-700">Recent Notifications</h2>
              )}
              {notifications.map((notification) => (
                <Notification 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
              
              {activeTab === 'notifications' && notifications.length === 0 && (
                <div className="p-4 text-gray-500 text-center">No notifications yet</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}