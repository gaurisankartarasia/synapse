

'use client';

import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@mui/material";

interface ChatMessagesProps {
  userId: string;
}

export default function ChatMessages({ userId }: ChatMessagesProps) {
  const { user, loading: authLoading } = useAuth();
  const { messages, loading, error, loadMoreMessages } = useChatMessages(userId, user);

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <div>Please log in to view messages.</div>;
  }

  const deleteMessage = async (messageId: string, roomId?: string) => {
    if (!roomId) {
      console.error('roomId is undefined');
      return;
    }

    try {
      const response = await fetch('/api/chat/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          messageId,
          roomId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
       {messages.length > 0 && (
        <Button onClick={loadMoreMessages}>Load More</Button>
      )}
      {messages.length === 0 ? (
        <p>No messages</p>
        
      ) : (
        
        messages.map((msg) => (
          
          <div key={msg.id}>
            <p>{msg.content}</p>
            <span>{msg.time}</span>
            {user && msg.senderId === user.uid && (
              <Button onClick={() => deleteMessage(msg.id, msg.roomId)}>Delete</Button>
            )}
          </div>
        ))
      )}
     
    </div>
  );
}