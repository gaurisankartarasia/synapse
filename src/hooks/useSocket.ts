// import { useEffect, useRef } from 'react';
// import io, { Socket } from 'socket.io-client';
// import { useAuth } from '@/hooks/useAuth';

// export const useSocket = () => {
//   const { user } = useAuth();
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     const initSocket = async () => {
//       try {
//         // Initialize socket server
//         await fetch('/api/socket');

//         // Create socket connection
//         const socket = io('http://localhost:3001', {
//           withCredentials: true,
//           transports: ['websocket', 'polling'],
//         });

//         socket.on('connect', () => {
//           console.log('Socket connected with ID:', socket.id);
//           if (user?.uid) {
//             socket.emit('join-user-room', user.uid);
//           }
//         });

//         socket.on('connect_error', (error) => {
//           console.error('Socket connection error:', error);
//         });

//         socketRef.current = socket;
//       } catch (error) {
//         console.error('Socket initialization error:', error);
//       }
//     };

//     if (user && !socketRef.current) {
//       initSocket();
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, [user]);

//   return socketRef.current;
// };








import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        if (!user) return;

        const token = await user.getIdToken();
        
        // Initialize socket server
        await fetch('/api/socket');

        // Create socket connection with auth token
        const socket = io('http://localhost:3001', {
          withCredentials: true,
          transports: ['websocket'],
          auth: { token },
        });

        socket.on('connect', () => {
          console.log('Socket connected with ID:', socket.id);
          socket.emit('join-user-room', user.uid);
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        socketRef.current = socket;
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return socketRef.current;
};