// import { Server as NetServer } from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import { NextApiResponse } from 'next';

// export type NextApiResponseWithSocket = NextApiResponse & {
//   socket: {
//     server: NetServer & {
//       io?: SocketIOServer;
//     };
//   };
// };

// export const initSocket = (res: NextApiResponseWithSocket) => {
//   if (!res.socket.server.io) {
//     const io = new SocketIOServer(res.socket.server);
//     res.socket.server.io = io;

//     io.on('connection', (socket) => {
//       console.log('Client connected:', socket.id);

//       // Join user to their specific room
//       socket.on('join-user-room', (userId: string) => {
//         socket.join(userId);
//       });

//       // Handle chat room updates
//       socket.on('join-chat-room', (roomId: string) => {
//         socket.join(roomId);
//       });

//       socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//       });
//     });
//   }
//   return res.socket.server.io;
// };








import { Server as SocketIO } from 'socket.io';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    // @ts-ignore
    if (!global.io) {
      console.log('Initializing Socket.io server...');
      // @ts-ignore
      global.io = new SocketIO(3001, {
        cors: {
          origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });

      // @ts-ignore
      global.io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token;
          if (!token) {
            throw new Error('Authentication error');
          }
          
          const decodedToken = await auth.verifyIdToken(token);
          socket.userId = decodedToken.uid;
          next();
        } catch (error) {
          next(new Error('Authentication error'));
        }
      });

      // @ts-ignore
      global.io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join-user-room', (userId: string) => {
          if (socket.userId === userId) {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
          }
        });

        socket.on('join-chat-room', (roomId: string) => {
          socket.join(roomId);
          console.log(`Socket joined room: ${roomId}`);
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected:', socket.id);
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to start socket server', details: error },
      { status: 500 }
    );
  }
}