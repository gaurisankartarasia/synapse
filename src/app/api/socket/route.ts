import { Server as SocketIO } from 'socket.io';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // @ts-ignore
    if (!global.io) {
      console.log('New Socket.io server...');
      // @ts-ignore
      global.io = new SocketIO(3001, {
        cors: {
          origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
    }

    // @ts-ignore
    global.io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('join-user-room', (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      socket.on('join-chat-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket joined room: ${roomId}`);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to start socket server', details: error },
      { status: 500 }
    );
  }
}