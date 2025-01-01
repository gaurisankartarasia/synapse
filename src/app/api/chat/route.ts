
// import { db } from '@/lib/firebaseAdmin';
// import { verifyAuth } from '@/utils/auth';
// import { NextRequest, NextResponse } from 'next/server';

// function formatTime(timestamp: number): string {
//   const date = new Date(timestamp);
//   return date.toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   }).toLowerCase(); // e.g., 03:15am
// }

// function formatDate(timestamp: number): string {
//   const date = new Date(timestamp);
//   return date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   }); // e.g., 04 December 2024
// }

// export async function POST(request: NextRequest) {
//   const decodedToken = await verifyAuth(request);
//   if (!('uid' in decodedToken)) {
//     return decodedToken;
//   }

//   const { targetUserId, message } = await request.json();

//   // Create a sorted array of user IDs to ensure consistent chat room creation
//   const participantIds = [decodedToken.uid, targetUserId].sort();
//   const participantKey = participantIds.join('_');

//   // Check if chat room exists
//   const chatRoomQuery = await db.collection('chatRooms')
//     .where('participantKey', '==', participantKey)
//     .get();

//   let chatRoomId;

//   if (chatRoomQuery.empty) {
//     // Create new chat room
//     const timestamp = Date.now();
//     const createdAt = Date.now();
//     const newChatRoom = await db.collection('chatRooms').add({
//       participants: participantIds,
//       participantKey: participantKey,
//       time: formatTime(timestamp),
//       createdAt: formatDate(createdAt),
     
//     });
//     chatRoomId = newChatRoom.id;
//   } else {
//     chatRoomId = chatRoomQuery.docs[0].id;
//   }

//   // Add message
//   const timestamp = Date.now();
//   const time = formatTime(timestamp);
//   const date = formatDate(timestamp);

//   const messageRef = await db.collection('chatRooms').doc(chatRoomId)
//     .collection('messages').add({
//       content: message,
//       senderId: decodedToken.uid,
//       time, // Separate time
//       date, // Separate date
//       read: false,
//     });

//   return NextResponse.json({ 
//     success: true, 
//     messageId: messageRef.id,
//     chatRoomId 
//   });
// }





// // app/api/chat/route.ts
// import { db } from '@/lib/firebaseAdmin';
// import { verifyAuth } from '@/utils/auth';
// import { NextRequest, NextResponse } from 'next/server';

// function formatTime(timestamp: number): string {
//   const date = new Date(timestamp);
//   return date.toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   }).toLowerCase();
// }

// function formatDate(timestamp: number): string {
//   const date = new Date(timestamp);
//   return date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   }); // e.g., 04 December 2024
// }


// export async function POST(request: NextRequest) {
//   const decodedToken = await verifyAuth(request);
//   if (!('uid' in decodedToken)) {
//     return decodedToken;
//   }

//   const { targetUserId, message } = await request.json();
//   const participantIds = [decodedToken.uid, targetUserId].sort();
//   const participantKey = participantIds.join('_');

//   // Check if chat room exists
//   const chatRoomQuery = await db.collection('chatRooms')
//     .where('participantKey', '==', participantKey)
//     .get();

//   let chatRoomId;
//   if (chatRoomQuery.empty) {
//     // Create new chat room
//     const timestamp = Date.now();
//     const newChatRoom = await db.collection('chatRooms').add({
//       participants: participantIds,
//       participantKey: participantKey,
//       createdAt: timestamp,
//     });
//     chatRoomId = newChatRoom.id;
//   } else {
//     chatRoomId = chatRoomQuery.docs[0].id;
//   }

//   // Add message with timestamp
//   const timestamp = Date.now();
//   const messageRef = await db.collection('chatRooms').doc(chatRoomId)
//     .collection('messages')
//     .add({
//       content: message,
//       senderId: decodedToken.uid,
//       timestamp: timestamp,  // Add this field for ordering
//       time: formatTime(timestamp),
//       date: formatDate(timestamp),
//       read: false,
//     });

//   return NextResponse.json({ success: true, messageId: messageRef.id, chatRoomId });
// }




import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

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
  }); // e.g., 04 December 2024
}

export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!('uid' in decodedToken)) {
    return decodedToken;
  }

  const { targetUserId, message } = await request.json();
  const participantIds = [decodedToken.uid, targetUserId].sort();
  const participantKey = participantIds.join('_');

  // Check if chat room exists
  const chatRoomQuery = await db.collection('chatRooms')
    .where('participantKey', '==', participantKey)
    .get();

  let chatRoomId;
  if (chatRoomQuery.empty) {
    // Create new chat room
    const timestamp = Date.now();
    const newChatRoom = await db.collection('chatRooms').add({
      participants: participantIds,
      participantKey: participantKey,
      createdAt: timestamp,
    });
    chatRoomId = newChatRoom.id;
  } else {
    chatRoomId = chatRoomQuery.docs[0].id;
  }

  // Add message with timestamp
  const timestamp = Date.now();
  const messageRef = await db.collection('chatRooms').doc(chatRoomId)
    .collection('messages')
    .add({
      content: message,
      senderId: decodedToken.uid,
      timestamp: timestamp,  // Add this field for ordering
      time: formatTime(timestamp),
      date: formatDate(timestamp),
      read: false,
    });

  return NextResponse.json({ success: true, messageId: messageRef.id, chatRoomId });
}