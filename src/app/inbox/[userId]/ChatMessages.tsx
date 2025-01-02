

'use client';
import { useEffect } from 'react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';
import { Button, CircularProgress } from "@mui/material";
import { Message } from '@/types/chat';

interface ChatMessagesProps {
  userId: string;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;  
  replyingTo: Message | null;
  editingMessage: Message | null;
}

export default function ChatMessages({ 
  userId, 
  onReply, 
  onEdit,
}: ChatMessagesProps) {
  const { user, loading: authLoading } = useAuth();
  const { messages, loading, error, loadMoreMessages, hasMore } = useChatMessages(userId, user);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const firstUnreadMsg = messages.find(msg => 
      msg.senderId !== user?.uid && !msg.readBy?.includes(user?.uid)
    );
    
    if (firstUnreadMsg?.roomId) {
      markAsRead(firstUnreadMsg.roomId);
    }
  }, [authLoading, user, messages]);

  const markAsRead = async (roomId: string) => {
    if (!user) return; // Add null check
    try {
      await fetch('/api/chat/markAsRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ roomId })
      });
    } catch (error) {
      console.error('Failed to mark messages as read', error);
    }
  };

  const getReadStatus = (msg: Message) => {
    if (!msg.sent) return null;
    if (msg.readBy?.length > 0) {
      return <span className="text-blue-500">✓✓</span>;
    }
    return <span className="text-gray-500">✓</span>;
  };

  const deleteMessage = async (messageId: string, roomId: string | undefined, deleteType: 'me' | 'everyone') => {
    if (!user) return; // Add null check
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
          deleteType
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

  if (authLoading) return <div>Loading authentication...</div>;
  if (!user) return <div>Please log in to view messages.</div>;

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pb-32">
      {messages.length > 0 && hasMore && (
        <Button onClick={loadMoreMessages}>Load older messages..</Button>
      )}
      {messages.length === 0 ? (
        <p>No messages</p>
      ) : (
        messages.map((msg) => {
          if (!msg.id || !msg.roomId || msg.deletedFor?.includes(user.uid)) {
            return null;
          }

          return (
            <div key={msg.id} className="p-4 border-b">
              <span>{msg.time}</span>
              {msg.replyTo && !msg.deletedForEveryone && (
                <div className="ml-4 pl-2 border-l-2 border-gray-300 mb-2">
                  <p className="text-sm text-gray-600">
                    Replying to: {msg.replyTo.content}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={msg.deletedForEveryone ? "italic text-gray-500" : ""}>
                    {msg.deletedForEveryone ? "This message was deleted" : msg.content}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {msg.edited && !msg.deletedForEveryone && (
                      <span className="text-xs">(edited)</span>
                    )}
                    {msg.senderId === user?.uid && getReadStatus(msg)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!msg.deletedForEveryone && (
                    <>
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
                            onClick={() => deleteMessage(msg.id, msg.roomId, 'everyone')}
                            size="small"
                            color="error"
                          >
                            Delete for everyone
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  <Button 
                    onClick={() => deleteMessage(msg.id, msg.roomId, 'me')}
                    size="small"
                    color="error"
                  >
                    {msg.deletedForEveryone ? "Delete" : "Delete for me"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}