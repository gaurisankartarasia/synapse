import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) {
    return decodedToken;
  }

  const { messageId, roomId, content, editedAt } = await request.json();

  const batch = db.batch();

  // Get the message to verify ownership
  const messageRef = db.collection('chatRooms').doc(roomId)
    .collection('messages').doc(messageId);
  const messageDoc = await messageRef.get();

  if (!messageDoc.exists) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  const messageData = messageDoc.data();
  if (messageData?.senderId !== decodedToken.uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Update the message
  batch.update(messageRef, {
    content,
    edited: editedAt
  });

  // Commit the batch
  await batch.commit();

  return NextResponse.json({ status: 'ok' });
}