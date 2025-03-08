// import { useEffect,useState, useRef, useCallback } from 'react';

// interface WebSocketMessage {
//   type: string;
//   message: string;
// }

// export const useWebSocket = (url: string) => {
//   const wsRef = useRef<WebSocket | null>(null);
//   const [messages, setMessages] = useState<WebSocketMessage[]>([]);

//   const handleMessage = useCallback((event: MessageEvent) => {
//     const data: WebSocketMessage = JSON.parse(event.data);
//     setMessages(prev => [...prev, data]);
//   }, []);

//   useEffect(() => {
//     wsRef.current = new WebSocket(url);

//     wsRef.current.addEventListener('open', () => {
//       console.log('WebSocket connected');
//     });

//     wsRef.current.addEventListener('message', handleMessage);

//     return () => {
//       wsRef.current?.close();
//     };
//   }, [url, handleMessage]);

//   const sendMessage = useCallback((message: string) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ type: 'message', message }));
//     }
//   }, []);

//   return { messages, sendMessage };
// };




import { useEffect, useState, useRef, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  message: string;
}

export const useWebSocket = (url: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [notificationCount, setNotificationCount] = useState(0); // Add state for badge count

  const handleMessage = useCallback((event: MessageEvent) => {
    const data: WebSocketMessage = JSON.parse(event.data);
    setMessages((prev) => [...prev, data]);

    if (data.type === "notification") {
      setNotificationCount((prev) => prev + 1); // Increment badge count
    }
  }, []);

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.addEventListener("open", () => {
      console.log("WebSocket connected");
    });

    wsRef.current.addEventListener("message", handleMessage);

    return () => {
      wsRef.current?.close();
    };
  }, [url, handleMessage]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", message }));
    }
  }, []);

  return { messages, sendMessage, notificationCount };
};
