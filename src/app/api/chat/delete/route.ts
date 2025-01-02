
// app/api/chat/delete/route.ts
import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) {
    return decodedToken;
  }

  const { messageId, roomId, deleteType } = await request.json();
  
  const messageRef = db.collection('chatRooms').doc(roomId)
    .collection('messages').doc(messageId);

  const messageDoc = await messageRef.get();
  if (!messageDoc.exists) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  const messageData = messageDoc.data();
  const currentDeletedFor = messageData?.deletedFor || [];

  if (deleteType === 'everyone') {
    if (messageData?.senderId !== decodedToken.uid) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this message for everyone' },
        { status: 403 }
      );
    }
    
    await messageRef.update({
      deletedForEveryone: true,
      content: 'This message was deleted',
      deletedAt: Date.now()
    });
  } else {
    if (!currentDeletedFor.includes(decodedToken.uid)) {
      await messageRef.update({
        deletedFor: [...currentDeletedFor, decodedToken.uid]
      });
    }
  }

  return NextResponse.json({ status: 'ok' });
}