
//useChatMessages.ts
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseClient';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  startAfter, 
  DocumentData,
  getDocs
} from 'firebase/firestore';
import { Message } from '@/types/chat';

const BATCH_SIZE = 10;

export const useChatMessages = (userId: string, currentUserId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const setupMessagesSubscription = useCallback(async () => {
    try {
      const participantIds = [currentUserId, userId].sort();
      const participantKey = participantIds.join('_');

      const chatRoomQuery = query(
        collection(db, 'chatRooms'),
        where('participantKey', '==', participantKey)
      );

      return onSnapshot(chatRoomQuery, async (snapshot) => {
        if (!snapshot.empty) {
          const roomId = snapshot.docs[0].id;

          const messagesQuery = query(
            collection(db, `chatRooms/${roomId}/messages`),
            orderBy('timestamp', 'desc'),
            limit(BATCH_SIZE)
          );

          return onSnapshot(messagesQuery, (msgSnapshot) => {
            const lastVisibleDoc = msgSnapshot.docs[msgSnapshot.docs.length - 1];
            setLastVisible(lastVisibleDoc);
            setHasMore(msgSnapshot.docs.length === BATCH_SIZE);

            // const msgs = msgSnapshot.docs.map(doc => ({
            //   id: doc.id,
            //   roomId: roomId,
            //   ...doc.data(),
            //   deletedFor: doc.data().deletedFor || []
            // } as Message));

// useChatMessages.ts
const msgs = msgSnapshot.docs.map(doc => {
  const data = doc.data();
  const timestamp = data.timestamp; // Firestore Timestamp object
  return {
    id: doc.id,
    roomId: roomId,
    ...data,
    timestamp: {
      _seconds: timestamp.seconds,
      _nanoseconds: timestamp.nanoseconds,
    },
    deletedFor: data.deletedFor || []
  } as Message;
});

            setMessages(msgs.reverse());
            setLoading(false);
          });
        } else {
          setMessages([]);
          setHasMore(false);
          setLoading(false);
          return () => {};
        }
      });
    } catch (error) {
      setError('Failed to load messages');
      setLoading(false);
      return () => {};
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let unsubscribeRoom: (() => void) | undefined;
    let unsubscribeMessages: (() => void) | undefined;

    const setup = async () => {
      unsubscribeRoom = await setupMessagesSubscription();
    };

    setup();

    return () => {
      unsubscribeMessages?.();
      unsubscribeRoom?.();
    };
  }, [setupMessagesSubscription]);

  const loadMoreMessages = async () => {
    if (!lastVisible) return;
    
    const participantIds = [currentUserId, userId].sort();
    const participantKey = participantIds.join('_');
    const chatRoomQuery = query(
      collection(db, 'chatRooms'),
      where('participantKey', '==', participantKey)
    );

    const roomSnapshot = await getDocs(chatRoomQuery);
    if (roomSnapshot.empty) return;

    const roomId = roomSnapshot.docs[0].id;
    const nextMessagesQuery = query(
      collection(db, `chatRooms/${roomId}/messages`),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(BATCH_SIZE)
    );

    const nextSnapshot = await getDocs(nextMessagesQuery);
    const lastVisibleDoc = nextSnapshot.docs[nextSnapshot.docs.length - 1];
    setLastVisible(lastVisibleDoc);
    setHasMore(nextSnapshot.docs.length === BATCH_SIZE);

    const moreMessages = await Promise.all(nextSnapshot.docs.map(async (doc) => {
      const messageData = doc.data();
      

      return {
        id: doc.id,
        roomId: roomId,
        ...messageData,
        deletedFor: messageData.deletedFor || []
      } as Message;
      
    }));

    setMessages(prevMessages => [...moreMessages.reverse(), ...prevMessages]);
  };

  return { messages, loading, error, loadMoreMessages, hasMore };
};


