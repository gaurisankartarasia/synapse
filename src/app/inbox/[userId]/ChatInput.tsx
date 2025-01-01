

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@mui/material";

interface ChatinputProps {
  userId: string;
}

export default function ChatInput({ userId }: ChatinputProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      setError(null);
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          targetUserId: userId,
          message: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message');
    }
  };

  return (
    <div className="fixed bottom-0">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        disabled={!user || !!error}
      />
      <Button onClick={sendMessage} disabled={!newMessage.trim() || !!error}>
        Send
      </Button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}