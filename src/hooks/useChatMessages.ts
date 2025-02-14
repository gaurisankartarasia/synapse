
// //useChatMessages.ts
// import { useState, useEffect, useCallback } from 'react';
// import { db } from '@/lib/firebaseClient';
// import { 
//   collection, 
//   query, 
//   where, 
//   onSnapshot, 
//   orderBy, 
//   limit, 
//   startAfter, 
//   DocumentData,
//   getDocs
// } from 'firebase/firestore';
// import { Message } from '../types/chat';

// const BATCH_SIZE = 50;

// export const useChatMessages = (userId: string, currentUserId: string) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
//   const [hasMore, setHasMore] = useState(true);

//   const setupMessagesSubscription = useCallback(async () => {
//     try {
//       const participantIds = [currentUserId, userId].sort();
//       const participantKey = participantIds.join('_');

//       const chatRoomQuery = query(
//         collection(db, 'chatRooms'),
//         where('participantKey', '==', participantKey)
//       );

//       return onSnapshot(chatRoomQuery, async (snapshot) => {
//         if (!snapshot.empty) {
//           const roomId = snapshot.docs[0].id;

//           const messagesQuery = query(
//             collection(db, `chatRooms/${roomId}/messages`),
//             orderBy('timestamp', 'desc'),
//             limit(BATCH_SIZE)
//           );

//           return onSnapshot(messagesQuery, (msgSnapshot) => {
//             const lastVisibleDoc = msgSnapshot.docs[msgSnapshot.docs.length - 1];
//             setLastVisible(lastVisibleDoc);
//             setHasMore(msgSnapshot.docs.length === BATCH_SIZE);

//             const msgs = msgSnapshot.docs.map(doc => ({
//               id: doc.id,
//               roomId: roomId,
//               ...doc.data(),
//               deletedFor: doc.data().deletedFor || []
//             } as Message));

//             setMessages(msgs.reverse());
//             setLoading(false);
//           });
//         } else {
//           setMessages([]);
//           setHasMore(false);
//           setLoading(false);
//           return () => {};
//         }
//       });
//     } catch (error) {
//       setError('Failed to load messages');
//       setLoading(false);
//       return () => {};
//     }
//   }, [userId, currentUserId]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     let unsubscribeRoom: (() => void) | undefined;
//     let unsubscribeMessages: (() => void) | undefined;

//     const setup = async () => {
//       unsubscribeRoom = await setupMessagesSubscription();
//     };

//     setup();

//     return () => {
//       unsubscribeMessages?.();
//       unsubscribeRoom?.();
//     };
//   }, [setupMessagesSubscription]);

//   const loadMoreMessages = async () => {
//     if (!lastVisible) return;
    
//     const participantIds = [currentUserId, userId].sort();
//     const participantKey = participantIds.join('_');
//     const chatRoomQuery = query(
//       collection(db, 'chatRooms'),
//       where('participantKey', '==', participantKey)
//     );

//     const roomSnapshot = await getDocs(chatRoomQuery);
//     if (roomSnapshot.empty) return;

//     const roomId = roomSnapshot.docs[0].id;
//     const nextMessagesQuery = query(
//       collection(db, `chatRooms/${roomId}/messages`),
//       orderBy('timestamp', 'desc'),
//       startAfter(lastVisible),
//       limit(BATCH_SIZE)
//     );

//     const nextSnapshot = await getDocs(nextMessagesQuery);
//     const lastVisibleDoc = nextSnapshot.docs[nextSnapshot.docs.length - 1];
//     setLastVisible(lastVisibleDoc);
//     setHasMore(nextSnapshot.docs.length === BATCH_SIZE);

//     const moreMessages = await Promise.all(nextSnapshot.docs.map(async (doc) => {
//       const messageData = doc.data();
//       return {
//         id: doc.id,
//         roomId: roomId,
//         ...messageData,
//         deletedFor: messageData.deletedFor || []
//       } as Message;
//     }));

//     setMessages(prevMessages => [...moreMessages.reverse(), ...prevMessages]);
//   };

//   return { messages, loading, error, loadMoreMessages, hasMore };
// };




// hooks/useChatMessages.ts
import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message } from '@/types/chat';

const BATCH_SIZE = 50;

export const useChatMessages = (userId: string, currentUserId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      query: { userId: currentUserId }
    });

    setSocket(newSocket);

    // Join the chat room
    const roomId = [currentUserId, userId].sort().join('_');
    newSocket.emit('joinRoom', roomId);

    // Listen for new messages
    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for message updates (edits, deletes)
    newSocket.on('messageUpdated', (updatedMessage: Message) => {
      setMessages(prev => prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      ));
    });

    // Initial message load
    fetchInitialMessages(roomId);

    return () => {
      newSocket.emit('leaveRoom', roomId);
      newSocket.close();
    };
  }, [userId, currentUserId]);

  const fetchInitialMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${roomId}?page=1&limit=${BATCH_SIZE}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data.messages);
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (error) {
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore) return;
    
    const nextPage = page + 1;
    const roomId = [currentUserId, userId].sort().join('_');
    
    try {
      const response = await fetch(
        `/api/chat/messages/${roomId}?page=${nextPage}&limit=${BATCH_SIZE}`
      );
      if (!response.ok) throw new Error('Failed to fetch more messages');
      
      const data = await response.json();
      setMessages(prev => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (error) {
      setError('Failed to load more messages');
    }
  };

  return { messages, loading, error, loadMoreMessages, hasMore, socket };
};