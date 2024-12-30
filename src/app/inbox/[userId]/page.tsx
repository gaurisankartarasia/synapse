

// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { db } from '@/lib/firebaseClient';
// import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
// import { Message } from '../../../types/chat';
// import { useRouter } from 'next/navigation';

// export default function ChatPage({ params }: { params: { userId: string } }) {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Handle authentication and redirect
//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/signin?redirect=' + encodeURIComponent(window.location.pathname));
//     }
//   }, [authLoading, user, router]);

//   // Handle messages subscription
//   useEffect(() => {
//     let unsubscribeMessages: (() => void) | undefined;
//     let unsubscribeRoom: (() => void) | undefined;

//     const setupMessagesSubscription = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         setError(null);

//         const participantIds = [user.uid, params.userId].sort();
//         const participantKey = participantIds.join('_');
        
//         const chatRoomQuery = query(
//           collection(db, 'chatRooms'),
//           where('participantKey', '==', participantKey)
//         );

//         unsubscribeRoom = onSnapshot(chatRoomQuery, 
//           (snapshot) => {
//             if (!snapshot.empty) {
//               const roomId = snapshot.docs[0].id;
              
//               const messagesQuery = query(
//                 collection(db, `chatRooms/${roomId}/messages`),
//                 orderBy('timestamp', 'asc')
//               );

//               unsubscribeMessages = onSnapshot(messagesQuery, 
//                 (msgSnapshot) => {
//                   const msgs = msgSnapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data(),
//                   } as Message));
//                   setMessages(msgs);
//                   setLoading(false);
//                 },
//                 (error) => {
//                   console.error('Error in messages subscription:', error);
//                   setError('Failed to load messages');
//                   setLoading(false);
//                 }
//               );
//             } else {
//               setMessages([]);
//               setLoading(false);
//             }
//           },
//           (error) => {
//             console.error('Error in chat room subscription:', error);
//             setError('Failed to load chat room');
//             setLoading(false);
//           }
//         );
//       } catch (error) {
//         console.error('Error setting up subscriptions:', error);
//         setError('Failed to setup chat');
//         setLoading(false);
//       }
//     };

//     setupMessagesSubscription();

//     return () => {
//       unsubscribeMessages?.();
//       unsubscribeRoom?.();
//     };
//   }, [user, params.userId]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !user) return;

//     try {
//       setError(null);
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${await user.getIdToken()}`
//         },
//         body: JSON.stringify({
//           targetUserId: params.userId,
//           message: newMessage.trim()
//         })
//       });

//       if (response.ok) {
//         setNewMessage('');
//       } else {
//         const data = await response.json();
//         setError(data.error || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setError('Failed to send message');
//     }
//   };

//   if (authLoading || loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     );
//   }
  

//   return (
//     <div>
//       <div>
//         {messages.length === 0 ? (
//           <p>No messages</p>
//         ) : (
//           messages.map((msg) => (
//             <div key={msg.id}>
//               <p>{msg.content}</p>
//               <span>{msg.time}</span>
//             </div>
//           ))
//         )}
//       </div>

//       <div className='fixed bottom-0'>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//           disabled={loading || !!error}
//         />
//         <button
        
//           onClick={sendMessage}
//           disabled={loading || !newMessage.trim() || !!error}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }










// "use client";
// import { useAuth } from '@/hooks/useAuth';
// import ChatMessages from './ChatMessages';
// import ChatInput from './ChatInput';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function ChatPage({ params }: { params: { userId: string } }) {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
//     }
//   }, [authLoading, user, router]);

//   if (authLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex justify-center w-full">
//       <ChatMessages userId={params.userId} user={user} />
//       <ChatInput userId={params.userId} />
//     </div>
//   );
// }





"use client";
import { useAuth } from '@/hooks/useAuth';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { use } from 'react';

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Unwrap the params object
  const { userId } = use(params);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center w-full">
      <ChatMessages userId={userId} user={user} />
      <ChatInput userId={userId} />
    </div>
  );
}
