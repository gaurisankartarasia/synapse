
'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  userId: string;
  replyingTo: Message | null;
  editingMessage: Message | null;
  onCancelAction: () => void;
}

export default function ChatInput({ 
  userId, 
  replyingTo, 
  editingMessage, 
  onCancelAction 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Set message content when editing
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
    } else {
      setMessage('');
    }
  }, [editingMessage]);

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  };

  const handleAction = async () => {
    if (!message.trim()) return;

    try {
      setError(null);
      
      if (editingMessage) {
        // Handle edit
        const timestamp = Date.now();
        const response = await fetch('/api/chat/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: This includes cookies in the request
          body: JSON.stringify({
            messageId: editingMessage.id,
            roomId: editingMessage.roomId,
            content: message.trim(),
            editedAt: {
              timestamp,
              time: formatTime(timestamp)
            }
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to edit message');
        }
      } else {
        // Handle new message or reply
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: This includes cookies in the request
          body: JSON.stringify({
            targetUserId: userId,
            message: message.trim(),
            replyTo: replyingTo ? {
              id: replyingTo.id,
              content: replyingTo.content,
              senderId: replyingTo.senderId
            } : null
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to send message');
        }
      }

      setMessage('');
      onCancelAction();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process message');
    }
  };

  const getActionButton = () => {
    if (editingMessage) return 'Save';
    if (replyingTo) return 'Reply';
    return 'Send';
  };

  return (
    <div className="fixed bottom-14  p-4 border-t bg-background">
      {(replyingTo || editingMessage) && (
        <div className="flex items-center justify-between  p-2  mb-2">
          <p className="text-sm ">
            {editingMessage ? 'Editing message' : `Replying to: ${replyingTo?.content}`}
          </p>
          <Button 
          variant='outline'   
            onClick={onCancelAction}
            color="inherit"
          >
            Cancel
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          className=" p-2"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAction()}
          disabled={!!error}
          placeholder={
            editingMessage 
              ? "Edit your message..." 
              : replyingTo 
                ? "Type your reply..." 
                : "Type a message..."
          }
        />
        <Button 
          onClick={handleAction} 
          disabled={!message.trim() || !!error}
        >
          {getActionButton()}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
}






