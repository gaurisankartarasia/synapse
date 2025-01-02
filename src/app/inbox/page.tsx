
// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { db } from '@/lib/firebaseClient';
// import { onSnapshot, query, where, collection, orderBy, limit, getDocs, doc as firestoreDoc, getDoc } from 'firebase/firestore';

// interface ChatRoom {
//   id: string;
//   participants: string[];
//   participantKey: string;
//   lastMessage: {
//     content: string;
//     timestamp: number;
//     senderId: string;
//   } | null;
//   otherUser: {
//     username: string;
//   };
// }

// const InboxPage = () => {
//   const { user, loading } = useAuth();
//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (loading || !user) return;

//     const chatRoomsQuery = query(
//       collection(db, 'chatRooms'),
//       where('participants', 'array-contains', user.uid)
//     );

//     const unsubscribe = onSnapshot(chatRoomsQuery, async (snapshot) => {
//       try {
//         const roomsPromises = snapshot.docs.map(async (snapshotDoc) => {
//           const roomData = snapshotDoc.data();
//           const otherUserId = roomData.participants.find((id: string) => id !== user.uid);

//           // Get all messages
//           const messagesQuery = query(
//             collection(db, 'chatRooms', snapshotDoc.id, 'messages'),
//             orderBy('timestamp', 'desc')
//           );
//           const messagesSnapshot = await getDocs(messagesQuery);

//           // Get other user's data
//           const otherUserDocRef = firestoreDoc(db, 'users', otherUserId);
//           const otherUserDoc = await getDoc(otherUserDocRef);

//           const room: ChatRoom = {
//             id: snapshotDoc.id,
//             participants: roomData.participants,
//             participantKey: roomData.participantKey,
//             lastMessage: messagesSnapshot.empty ? null : messagesSnapshot.docs[0].data() as ChatRoom['lastMessage'],
//             otherUser: otherUserDoc.data() as { username: string } || { username: 'Unknown User' }
//           };

//           return room;
//         });

//         const rooms = await Promise.all(roomsPromises);
//         setChatRooms(rooms.sort((a, b) => 
//           ((b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))
//         ));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       }
//     }, (err) => {
//       setError(err.message);
//     });
    
//     return () => unsubscribe();
//   }, [user, loading]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Messages</h1>
//       {chatRooms.map((room) => (
//         <div key={room.id}>
//           <h3>{room.otherUser.username}</h3>
//           {room.lastMessage && (
//             <>
//               <p>{room.lastMessage.content}</p>
//               <span>{new Date(room.lastMessage.timestamp).toLocaleDateString()}</span>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default InboxPage;







'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebaseClient';
import { onSnapshot, query, where, collection, orderBy, doc as firestoreDoc, getDoc } from 'firebase/firestore';

interface ChatRoom {
  id: string;
  participants: string[];
  participantKey: string;
  lastMessage: {
    content: string;
    timestamp: number;
    senderId: string;
  } | null;
  otherUser: {
    displayName: string;
  };
}

const InboxPage = () => {
  const { user, loading } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;

    const chatRoomsQuery = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(chatRoomsQuery, async (snapshot) => {
      try {
        const roomsPromises = snapshot.docs.map(async (snapshotDoc) => {
          const roomData = snapshotDoc.data();
          const otherUserId = roomData.participants.find((id: string) => id !== user.uid);

          // Get other user's data
          const otherUserDocRef = firestoreDoc(db, 'users', otherUserId);
          const otherUserDoc = await getDoc(otherUserDocRef);

          const room: ChatRoom = {
            id: snapshotDoc.id,
            participants: roomData.participants,
            participantKey: roomData.participantKey,
            lastMessage: null,
            otherUser: otherUserDoc.data() as { displayName: string } || { displayName: 'Unknown User' }
          };

          // Set up a listener for messages in this chat room
          const messagesQuery = query(
            collection(db, 'chatRooms', snapshotDoc.id, 'messages'),
            orderBy('timestamp', 'desc')
          );

          onSnapshot(messagesQuery, (messagesSnapshot) => {
            if (!messagesSnapshot.empty) {
              const lastMessage = messagesSnapshot.docs[0].data() as ChatRoom['lastMessage'];
              setChatRooms((prevRooms) => {
                return prevRooms.map((r) => r.id === room.id ? { ...r, lastMessage } : r);
              });
            }
          });

          return room;
        });

        const rooms = await Promise.all(roomsPromises);
        setChatRooms(rooms);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }, (err) => {
      setError(err.message);
    });
    
    return () => unsubscribe();
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Messages</h1>
      {chatRooms.map((room) => (
        <div key={room.id}>
          <h3>{room.otherUser.displayName}</h3>
          {room.lastMessage && (
            <>
              <p>{room.lastMessage.content}</p>
              <span>{new Date(room.lastMessage.timestamp).toLocaleDateString()}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default InboxPage;