// import { useEffect, useState } from 'react';
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

// const useChatRooms = () => {
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

//   return { chatRooms, error, loading };
// };

// export default useChatRooms;






// src/hooks/useChatRooms.ts
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import type { ChatRoom, Message } from '@/types/chat';

export const useChatRooms = () => {
  const { user, loading } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    if (!user || loading) return;

    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        const token = await user.getIdToken();
        
        const response = await fetch('/api/chat/inbox', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        const data = await response.json();
        setChatRooms(data.chatRooms);
      } catch (err) {
        console.error('Error fetching chat rooms:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();

    if (socket) {
      socket.emit('join-user-room', user.uid);

      socket.on('chat-room-update', (updatedRoom: ChatRoom) => {
        setChatRooms(prevRooms => 
          prevRooms.map(room => 
            room.id === updatedRoom.id ? updatedRoom : room
          )
        );
      });

      socket.on('new-message', ({ roomId, message }: { roomId: string; message: Message }) => {
        setChatRooms(prevRooms =>
          prevRooms.map(room =>
            room.id === roomId
              ? { ...room, lastMessage: message }
              : room
          )
        );
      });

      return () => {
        socket.off('chat-room-update');
        socket.off('new-message');
      };
    }
  }, [user, loading, socket]);

  return { chatRooms, error, loading: isLoading };
};