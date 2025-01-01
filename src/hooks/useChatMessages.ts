
// import { useState, useEffect } from 'react';
// import { db } from '@/lib/firebaseClient';
// import { collection, query, where, onSnapshot, orderBy, limit, startAfter, DocumentData, QuerySnapshot, getDocs } from 'firebase/firestore';
// import { Message } from '../types/chat';

// const BATCH_SIZE = 5;

// export const useChatMessages = (userId: string, user: { uid: string } | null) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);

//   useEffect(() => {
//     if (!user) {
//       setError('User not authenticated');
//       setLoading(false);
//       return;
//     }

//     let unsubscribeMessages: (() => void) | undefined;
//     let unsubscribeRoom: (() => void) | undefined;

//     const setupMessagesSubscription = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const participantIds = [user.uid, userId].sort();
//         const participantKey = participantIds.join('_');

//         const chatRoomQuery = query(
//           collection(db, 'chatRooms'),
//           where('participantKey', '==', participantKey)
//         );

//         unsubscribeRoom = onSnapshot(chatRoomQuery, (snapshot) => {
//           if (!snapshot.empty) {
//             const roomId = snapshot.docs[0].id;

//             const messagesQuery = query(
//               collection(db, `chatRooms/${roomId}/messages`),
//               orderBy('timestamp', 'desc'),
//               limit(BATCH_SIZE)
//             );

//             unsubscribeMessages = onSnapshot(messagesQuery, (msgSnapshot: QuerySnapshot<DocumentData>) => {
//               const lastVisibleDoc = msgSnapshot.docs[msgSnapshot.docs.length - 1];
//               setLastVisible(lastVisibleDoc);

//               const msgs = msgSnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 roomId: roomId,
//                 ...doc.data(),
//               } as Message));
//               setMessages(msgs.reverse()); // Reverse to maintain the correct order
//               setLoading(false);
//             });
//           } else {
//             setMessages([]);
//             setLoading(false);
//           }
//         });
//       } catch (error) {
//         setError('Failed to load messages');
//         setLoading(false);
//       }
//     };

//     setupMessagesSubscription();

//     return () => {
//       unsubscribeMessages?.();
//       unsubscribeRoom?.();
//     };
//   }, [user, userId]);

//   const loadMoreMessages = async () => {
//     if (!lastVisible) return;
//     const participantIds = [user!.uid, userId].sort();
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

//     const moreMessages = nextSnapshot.docs.map(doc => ({
//       id: doc.id,
//       roomId: roomId,
//       ...doc.data(),
//     } as Message));
//     setMessages(prevMessages => [...moreMessages.reverse(), ...prevMessages]); // Reverse to maintain the correct order
//   };

//   return { messages, loading, error, loadMoreMessages };
// };











import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, where, onSnapshot, orderBy, limit, startAfter, DocumentData, QuerySnapshot, getDocs } from 'firebase/firestore';
import { Message } from '../types/chat';

const BATCH_SIZE = 5;

export const useChatMessages = (userId: string, user: { uid: string } | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  
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
              orderBy('timestamp', 'desc'),
              limit(BATCH_SIZE)
            );

            unsubscribeMessages = onSnapshot(messagesQuery, (msgSnapshot: QuerySnapshot<DocumentData>) => {
              const lastVisibleDoc = msgSnapshot.docs[msgSnapshot.docs.length - 1];
              setLastVisible(lastVisibleDoc);

              const msgs = msgSnapshot.docs.map(doc => ({
                id: doc.id,
                roomId: roomId,
                ...doc.data(),
              } as Message));
              setMessages(msgs.reverse()); // Reverse to maintain the correct order
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

  const loadMoreMessages = async () => {
    if (!lastVisible) return;
    const participantIds = [user!.uid, userId].sort();
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

    const moreMessages = nextSnapshot.docs.map(doc => ({
      id: doc.id,
      roomId: roomId,
      ...doc.data(),
    } as Message));
    setMessages(prevMessages => [...moreMessages.reverse(), ...prevMessages]); // Reverse to maintain the correct order
  };

  return { messages, loading, error, loadMoreMessages };
};