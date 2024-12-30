//app/inbox/[userId]/chatMessages.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Message } from '../../../types/chat';

interface ChatMessagesProps {
  userId: string;
  user: { uid: string } | null;
}

export default function ChatMessages({ userId, user }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    let unsubscribeMessages: (() => void) | undefined;
    let unsubscribeRoom: (() => void) | undefined;

    const setupMessagesSubscription = async () => {
      try {
        setLoading(true);
        setError(null);

        const participantIds = [user.uid, userId].sort();
        const participantKey = participantIds.join('_');
        
        const chatRoomQuery = query(
          collection(db, 'chatRooms'),
          where('participantKey', '==', participantKey)
        );

        unsubscribeRoom = onSnapshot(chatRoomQuery, (snapshot) => {
          if (!snapshot.empty) {
            const roomId = snapshot.docs[0].id;

            const messagesQuery = query(
              collection(db, `chatRooms/${roomId}/messages`),
              orderBy('timestamp', 'asc')
            );

            unsubscribeMessages = onSnapshot(messagesQuery, (msgSnapshot) => {
              const msgs = msgSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              } as Message));
              setMessages(msgs);
              setLoading(false);
            });
          } else {
            setMessages([]);
            setLoading(false);
          }
        });
      } catch (error) {
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    setupMessagesSubscription();

    return () => {
      unsubscribeMessages?.();
      unsubscribeRoom?.();
    };
  }, [user, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {messages.length === 0 ? (
        <p>No messages</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id}>
            <p>{msg.content}</p>
            <span>{msg.time}</span>
          </div>
        ))
      )}
    </div>
  );
}



