
// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { db } from '@/lib/firebaseClient';
// import { onSnapshot, query, where, collection, orderBy, doc as firestoreDoc, getDoc } from 'firebase/firestore';

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
//     displayName: string;
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

//           // Get other user's data
//           const otherUserDocRef = firestoreDoc(db, 'users', otherUserId);
//           const otherUserDoc = await getDoc(otherUserDocRef);

//           const room: ChatRoom = {
//             id: snapshotDoc.id,
//             participants: roomData.participants,
//             participantKey: roomData.participantKey,
//             lastMessage: null,
//             otherUser: otherUserDoc.data() as { displayName: string } || { displayName: 'Unknown User' }
//           };

//           // Set up a listener for messages in this chat room
//           const messagesQuery = query(
//             collection(db, 'chatRooms', snapshotDoc.id, 'messages'),
//             orderBy('timestamp', 'desc')
//           );

//           onSnapshot(messagesQuery, (messagesSnapshot) => {
//             if (!messagesSnapshot.empty) {
//               const lastMessage = messagesSnapshot.docs[0].data() as ChatRoom['lastMessage'];
//               setChatRooms((prevRooms) => {
//                 return prevRooms.map((r) => r.id === room.id ? { ...r, lastMessage } : r);
//               });
//             }
//           });

//           return room;
//         });

//         const rooms = await Promise.all(roomsPromises);
//         setChatRooms(rooms);
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
//           <h3>{room.otherUser.displayName}</h3>
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








// 'use client'
// import React from 'react';
// import useChatRooms from '@/hooks/useInbox';

// const InboxPage = () => {
//   const { chatRooms, error, loading } = useChatRooms();

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Messages</h1>
//       {chatRooms.map((room) => (
//         <div key={room.id}>
//           <h3>{room.otherUser.displayName}</h3>
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







// src/app/inbox/page.tsx
'use client'
import React from 'react';
import { useChatRooms } from '@/hooks/useInbox';
import type { ChatRoom } from '@/types/chat';

const InboxPage = () => {
  const { chatRooms, error, loading } = useChatRooms();

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="space-y-4">
        {chatRooms.map((room: ChatRoom) => (
          <div 
            key={room.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{room.otherUser.displayName}</h2>
              {room.lastMessage && (
                <div className="text-sm text-gray-500">
                  <p className="line-clamp-1">{room.lastMessage.content}</p>
                  <time className="text-xs">
                    {new Date(room.lastMessage.timestamp).toLocaleString()}
                  </time>
                </div>
              )}
            </div>
          </div>
        ))}
        {chatRooms.length === 0 && (
          <div className="text-center text-gray-500">
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;