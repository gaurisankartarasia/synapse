

"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, Timestamp, getDocs, doc, getDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import LoaderSpinner from '@/components/Loader';

type Notification = {
  fromUid: string;
  timestamp: Timestamp | { _seconds: number; _nanoseconds: number } | Date | number;
  username: string;
  displayName: string;
  photoURL: string;
};

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
      if (currentUser) {
        fetchInitialNotifications(currentUser);
        const unsubscribeListener = setupRealtimeListener(currentUser);
        return () => unsubscribeListener();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchInitialNotifications = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data.followRequests);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching initial notifications:', err);
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const setupRealtimeListener = (currentUser: User) => {
    const q = query(
      collection(db, 'users', currentUser.uid, 'followRequests'),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, async (snapshot) => {
      const newNotifications: Notification[] = [];
      
      for (const change of snapshot.docChanges()) {
        if (change.type === 'added' || change.type === 'modified') {
          const fromUid = change.doc.id;
          const data = change.doc.data();
          
          try {
            const userDocRef = doc(db, 'users', fromUid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();
            
            if (userData) {
              newNotifications.push({
                fromUid,
                timestamp: data.timestamp,
                username: userData.username || 'Unknown Username',
                displayName: userData.displayName || 'Unknown Name',
                photoURL: userData.photoURL || '/default-profile.png',
              });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }

      setNotifications(prev => {
        const updatedNotifications = [...prev];
        newNotifications.forEach(newNotif => {
          const index = updatedNotifications.findIndex(n => n.fromUid === newNotif.fromUid);
          if (index !== -1) {
            updatedNotifications[index] = newNotif;
          } else {
            updatedNotifications.unshift(newNotif);
          }
        });
        return updatedNotifications;
      });
    }, (error) => {
      console.error('Error in real-time listener:', error);
      setError('Failed to update notifications in real-time');
    });
  };

  const handleAction = async (action: 'accept' | 'reject', fromUid: string) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/${action}-follow-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fromUid }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} follow request`);

      setNotifications(prev => prev.filter(notif => notif.fromUid !== fromUid));
    } catch (err) {
      console.error(`Error ${action}ing follow request:`, err);
      setError(`Failed to ${action} follow request`);
    }
  };

  const formatRelativeTime = (timestamp: Notification['timestamp']) => {
    let date: Date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'object' && '_seconds' in timestamp && '_nanoseconds' in timestamp) {
      // Handle Firestore server timestamp
      date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    } else {
      console.error('Invalid timestamp format:', timestamp);
      return 'Unknown time';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (!authChecked) {
    return <LoaderSpinner/>;
  }

  if (!user) {
    return <div>Please log in to view notifications.</div>;
  }

  if (loading) return <LoaderSpinner/>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.fromUid} className="notification-item">
              <div className="notification-content">
                <img src={notification.photoURL} alt={notification.username} className="notification-avatar" />
                <div className="notification-text">
                  <strong>{notification.displayName}</strong> (@{notification.username}) wants to follow you
                  <br />
                  <small>Received {formatRelativeTime(notification.timestamp)}</small>
                </div>
              </div>
              <div className="notification-actions">
                <button onClick={() => handleAction('accept', notification.fromUid)} className="accept-button">
                  Accept
                </button>
                <button onClick={() => handleAction('reject', notification.fromUid)} className="reject-button">
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsComponent;