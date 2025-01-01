

import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';
import { WriteBatch } from 'firebase-admin/firestore';

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }); 
}

export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) {
    return decodedToken;
  }

  const { targetUserId, message } = await request.json();
  const participantIds = [decodedToken.uid, targetUserId].sort();
  const participantKey = participantIds.join('_');

  const batch: WriteBatch = db.batch();
  let chatRoomId;

  // Check if chat room exists
  const chatRoomQuery = await db.collection('chatRooms')
    .where('participantKey', '==', participantKey)
    .get();

  if (chatRoomQuery.empty) {
    // Create new chat room
    const timestamp = Date.now();
    const newChatRoomRef = db.collection('chatRooms').doc();
    batch.set(newChatRoomRef, {
      participants: participantIds,
      participantKey: participantKey,
      createdAt: timestamp,
    });
    chatRoomId = newChatRoomRef.id;
  } else {
    chatRoomId = chatRoomQuery.docs[0].id;
  }

  // Add message with timestamp
  const timestamp = Date.now();
  const messageRef = db.collection('chatRooms').doc(chatRoomId)
    .collection('messages').doc();
  batch.set(messageRef, {
    content: message,
    senderId: decodedToken.uid,
    timestamp: timestamp,
    time: formatTime(timestamp),
    date: formatDate(timestamp),
    read: false,
  });

  await batch.commit();

  return NextResponse.json({ status: 'ok' });
}