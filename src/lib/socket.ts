import { useState, useEffect, useCallback } from 'react';

interface WebSocketHook {
  socket: WebSocket | null;
  messages: any[];
  isConnected: boolean;
  sendMessage: (message: any) => void;
  error: Error | null;
}

export function useWebSocket(url: string, onMessageCallback?: (message: any) => void): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  useEffect(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setSocket(ws);
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, parsedMessage]);
        
        if (onMessageCallback) {
          onMessageCallback(parsedMessage);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError(new Error('WebSocket connection error'));
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.error('WebSocket setup error:', err);
      setError(err instanceof Error ? err : new Error('Unknown WebSocket error'));
    }
  }, [url, onMessageCallback]);

  return {
    socket,
    messages,
    isConnected,
    sendMessage,
    error
  };
}