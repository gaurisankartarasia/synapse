

 //app/api/chat/[roomId]/route.ts

import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;


  // Verify authentication
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if chat room exists
  const chatRoom = await db.collection('chatRooms').doc(roomId).get();
  if (!chatRoom.exists) {
    return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
  }

  // Fetch messages in the chat room
  const messagesSnapshot = await db
    .collection('chatRooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();

  const messages = messagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(messages);
}



