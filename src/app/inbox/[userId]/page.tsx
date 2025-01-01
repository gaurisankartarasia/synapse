

// "use client";
// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import ChatMessages from './ChatMessages';
// import ChatInput from './ChatInput';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { use } from 'react';
// import { Message } from '@/types/chat';

// export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);

//   // Unwrap the params object
//   const { userId } = use(params);

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
//     }
//   }, [authLoading, user, router]);

//   const handleReply = (message: Message) => {
//     setReplyingTo(message);
//   };

//   if (authLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="">
//       <ChatMessages 
//         userId={userId}
//         onReply={handleReply}
//         replyingTo={replyingTo}
//       />
//       <ChatInput 
//         userId={userId}
//         replyingTo={replyingTo}
//         onCancelReply={() => setReplyingTo(null)}
//       />
//     </div>
//   );
// }






"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { use } from 'react';
import { Message } from '@/types/chat';

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const { userId } = use(params);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authLoading, user, router]);

  const handleReply = (message: Message) => {
    setEditingMessage(null); // Clear any editing state
    setReplyingTo(message);
  };

  const handleEdit = (message: Message) => {
    setReplyingTo(null); // Clear any reply state
    setEditingMessage(message);
  };

  const handleCancelAction = () => {
    setReplyingTo(null);
    setEditingMessage(null);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center w-full">
      <ChatMessages 
        userId={userId}
        onReply={handleReply}
        onEdit={handleEdit}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
      />
      <ChatInput 
        userId={userId}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onCancelAction={handleCancelAction}
      />
    </div>
  );
}