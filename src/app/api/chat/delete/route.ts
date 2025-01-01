
import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';
import { WriteBatch } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) {
    return decodedToken;
  }

  const { messageId, roomId } = await request.json();

  const batch: WriteBatch = db.batch();

  // Perform deletion
  const messageRef = db.collection('chatRooms').doc(roomId)
    .collection('messages').doc(messageId);
  batch.delete(messageRef);

  await batch.commit();

  return NextResponse.json({ status: 'ok' });
}