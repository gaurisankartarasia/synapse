
'use client';

import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@mui/material";
import { Message } from '@/types/chat';
import { useEffect } from 'react';

interface ChatMessagesProps {
  userId: string;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;  
  replyingTo: Message | null;
  editingMessage: Message | null;
  setTypingStatus: (status: boolean) => void; // Typing status setter
}

export default function ChatMessages({ 
  userId, 
  onReply, 
  onEdit,  
  replyingTo, 
  editingMessage,
  setTypingStatus
}: ChatMessagesProps) {
  const { user, loading: authLoading } = useAuth();
  const { messages, loading, error, loadMoreMessages, hasMore } = useChatMessages(userId, user);

  useEffect(() => {
    const handleTyping = (e: KeyboardEvent) => {
      setTypingStatus(true);
      setTimeout(() => setTypingStatus(false), 3000); // Reset after 3 seconds of inactivity
    };

    window.addEventListener('keydown', handleTyping);
    return () => {
      window.removeEventListener('keydown', handleTyping);
    };
  }, [setTypingStatus]);

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
    <div className="pb-32">
      {messages.length > 0 && hasMore && (
        <Button onClick={loadMoreMessages}>Load older messages..</Button>
      )}
      {messages.length === 0 ? (
        <p>No messages</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="p-4 border-b">
            {msg.replyTo && (
              <div className="ml-4 pl-2 border-l-2 border-gray-300 mb-2">
                <p className="text-sm text-gray-600">
                  Replying to: {msg.replyTo.content}
                </p>
              </div>
            )}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p>{msg.content}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>{msg.time}</span>
                  {msg.edited && (
                    <span className="text-xs">(edited)</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onReply(msg)}
                  size="small"
                >
                  Reply
                </Button>
                {user && msg.senderId === user.uid && (
                  <>
                    <Button 
                      onClick={() => onEdit(msg)}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deleteMessage(msg.id, msg.roomId)}
                      size="small"
                      color="error"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


