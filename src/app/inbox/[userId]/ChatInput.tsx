

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@mui/material";
import { Message } from '@/types/chat';


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
  const { user } = useAuth();
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
    if (!message.trim() || !user) return;

    try {
      setError(null);
      
      if (editingMessage) {
        // Handle edit
        const timestamp = Date.now();
        const response = await fetch('/api/chat/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
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
          throw new Error('Failed to edit message');
        }
      } else {
        // Handle new message or reply
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
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
          throw new Error('Failed to send message');
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
    <div className="fixed bottom-0 w-full bg-white p-4 border-t">
      {(replyingTo || editingMessage) && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
          <p className="text-sm text-gray-600">
            {editingMessage ? 'Editing message' : `Replying to: ${replyingTo?.content}`}
          </p>
          <Button 
            onClick={onCancelAction}
            size="small"
            color="inherit"
          >
            Cancel
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAction()}
          disabled={!user || !!error}
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
          variant="contained"
        >
          {getActionButton()}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
}