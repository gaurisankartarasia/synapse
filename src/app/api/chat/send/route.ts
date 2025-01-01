

// //app/api/chat/send/route.ts
// import { db } from '@/lib/firebaseAdmin';
// import { verifyAuth } from '@/utils/auth';
// import { NextRequest, NextResponse } from 'next/server';
// import { WriteBatch } from 'firebase-admin/firestore';

// function formatTime(timestamp: number): string {
//   const date = new Date(timestamp);
//   return date.toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   }).toLowerCase();
// }

// export async function POST(request: NextRequest) {
//     const decodedToken = await verifyAuth(request);
//     if (!('uid' in decodedToken)) {
//       return decodedToken;
//     }
  
//     const { targetUserId, message, replyTo } = await request.json();
//     const participantIds = [decodedToken.uid, targetUserId].sort();
//     const participantKey = participantIds.join('_');
  
//     const batch: WriteBatch = db.batch();
//     let chatRoomId;
  
//     // Check if chat room exists
//     const chatRoomQuery = await db.collection('chatRooms')
//       .where('participantKey', '==', participantKey)
//       .get();
  
//     if (chatRoomQuery.empty) {
//       // Create new chat room
//       const timestamp = Date.now();
//       const newChatRoomRef = db.collection('chatRooms').doc();
//       batch.set(newChatRoomRef, {
//         participants: participantIds,
//         participantKey: participantKey,
//         createdAt: timestamp,
//       });
//       chatRoomId = newChatRoomRef.id;
//     } else {
//       chatRoomId = chatRoomQuery.docs[0].id;
//     }
  
//     // Add message with timestamp
//     const timestamp = Date.now();
//     const messageRef = db.collection('chatRooms').doc(chatRoomId)
//       .collection('messages').doc();
    
//     const messageData = {
//       content: message,
//       senderId: decodedToken.uid,
//       timestamp: timestamp,
//       time: formatTime(timestamp),
//       date: (timestamp),
//       read: false,
//       ...(replyTo && { replyTo })
//     };
  
//     batch.set(messageRef, messageData);
//     await batch.commit();
  
//     return NextResponse.json({ status: 'ok' });
//   }











//app/api/chat/send/route.ts
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

export async function POST(request: NextRequest) {
    const decodedToken = await verifyAuth(request);
    if (!('uid' in decodedToken)) {
      return decodedToken;
    }
  
    const { targetUserId, message, replyTo } = await request.json();
    const participantIds = [decodedToken.uid, targetUserId].sort();
    const participantKey = participantIds.join('_');
  
    const batch = db.batch();
  
    // Check if chat room exists
    const chatRoomQuery = await db.collection('chatRooms')
      .where('participantKey', '==', participantKey)
      .get();
  
    let chatRoomId;
  
    if (chatRoomQuery.empty) {
      // Create new chat room
      const newChatRoomRef = db.collection('chatRooms').doc();
      batch.set(newChatRoomRef, {
        participants: participantIds,
        participantKey: participantKey,
        createdAt: Date.now(),
      });
      chatRoomId = newChatRoomRef.id;
    } else {
      chatRoomId = chatRoomQuery.docs[0].id;
    }
  
    // Add message with timestamp
    const timestamp = Date.now();
    const messageRef = db.collection('chatRooms').doc(chatRoomId)
      .collection('messages').doc();
  
    const messageData = {
      content: message,
      senderId: decodedToken.uid,
      timestamp,
      time: formatTime(timestamp),
      date: (timestamp),
      read: false,
      ...(replyTo && { replyTo })
    };
  
    batch.set(messageRef, messageData);
  
    // Commit all changes in one batch
    await batch.commit();
  
    return NextResponse.json({ status: 'ok' });
  }