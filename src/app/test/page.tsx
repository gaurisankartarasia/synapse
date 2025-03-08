
'use client'
import { useState } from 'react';
import { useWebSocket } from '@/hooks/websocket/useWebsocket';

export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useWebSocket('ws://localhost:5000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg.message}</li>
        ))}
      </ul>
    </div>
  );
}