  // components/Chat.tsx
  import { useEffect, useState } from 'react';
  import io, { Socket } from 'socket.io-client';

  interface Message {
    user: string;
    text: string;
    timestamp: number;
  }

  const Chat = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
      const socketInstance = io({
        path: '/api/socket',
      });
      setSocket(socketInstance);

      socketInstance.on('initialMessages', (msgs: Message[]) => {
        setMessages(msgs);
      });

      socketInstance.on('newMessage', (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socketInstance.disconnect();
      };
    }, []);

    const sendMessage = () => {
      if (socket && newMessage.trim()) {
        const message = {
          user: 'User', // Replace with actual user data
          text: newMessage,
          timestamp: Date.now(),
        };
        socket.emit('sendMessage', message);
        setNewMessage('');
      }
    };

    return (
      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    );
  };

  export default Chat;
