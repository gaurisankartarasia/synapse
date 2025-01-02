
//app/api/chat/send/route.ts
import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';


// app/api/chat/send/route.ts
export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) return decodedToken;

  const { targetUserId, message, replyTo } = await request.json();
  const participantIds = [decodedToken.uid, targetUserId].sort();
  const participantKey = participantIds.join('_');

  const batch = db.batch();
  const chatRoomQuery = await db.collection('chatRooms')
    .where('participantKey', '==', participantKey)
    .get();

  let chatRoomId;

  if (chatRoomQuery.empty) {
    const newChatRoomRef = db.collection('chatRooms').doc();
    batch.set(newChatRoomRef, {
      participants: participantIds,
      participantKey,
      createdAt: Date.now(),
      lastMessage: message,
      lastMessageTime: Date.now(),
      unreadCounts: {
        [targetUserId]: 1,
        [decodedToken.uid]: 0
      }
    });
    chatRoomId = newChatRoomRef.id;
  } else {
    chatRoomId = chatRoomQuery.docs[0].id;
    const roomRef = db.collection('chatRooms').doc(chatRoomId);
    const roomData = chatRoomQuery.docs[0].data();
    
    batch.update(roomRef, {
      lastMessage: message,
      lastMessageTime: Date.now(),
      [`unreadCounts.${targetUserId}`]: (roomData.unreadCounts?.[targetUserId] || 0) + 1
    });
  }

  const timestamp = Date.now();
  const messageRef = db.collection('chatRooms').doc(chatRoomId)
    .collection('messages').doc();

  batch.set(messageRef, {
    content: message,
    senderId: decodedToken.uid,
    timestamp,
    time: new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase(),
    deletedFor: [],
    deletedForEveryone: false,
    readBy: [],
    sent: true,
    ...(replyTo && { replyTo })
  });

  await batch.commit();
  return NextResponse.json({ status: 'ok' });
}
