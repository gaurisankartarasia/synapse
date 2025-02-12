// app/api/socket/route.ts
import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { parse } from 'url';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';

const io = new Server({
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

interface ConnectedUser {
  socketId: string;
  userId: string;
}

const connectedUsers = new Map<string, ConnectedUser>();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const payload = await verifyJWT(token);
    if (!payload.uid) {
      return next(new Error('Invalid token'));
    }

    socket.data.userId = payload.uid;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  connectedUsers.set(userId, { socketId: socket.id, userId });

  // Handle real-time message sending
  socket.on('send_message', async (data) => {
    try {
      const { targetUserId, message, replyTo } = data;
      const participantIds = [userId, targetUserId].sort();
      const participantKey = participantIds.join('_');

      // Save message to Firestore (reusing existing logic)
      const chatRoomQuery = await db.collection('chatRooms')
        .where('participantKey', '==', participantKey)
        .get();

      // ... (rest of your existing message saving logic)

      // Emit to target user if online
      const targetUser = connectedUsers.get(targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('receive_message', {
          senderId: userId,
          content: message,
          timestamp: Date.now(),
          chatRoomId: chatRoomQuery.docs[0].id,
        });
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
  });
});

const httpServer = createServer((req, res) => {
  const { pathname } = parse(req.url!, true);
  if (pathname === '/api/socket') {
    // Handle WebSocket
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end('WebSocket server is running');
  }
});

io.attach(httpServer);

export function GET(req: NextRequest) {
  httpServer.listen(process.env.WEBSOCKET_PORT || 3001);
  return new Response('WebSocket server initialized');
}