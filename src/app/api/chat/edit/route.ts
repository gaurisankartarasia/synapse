// import { db } from '@/lib/firebaseAdmin';
// import { verifyAuth } from '@/utils/auth';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   const decodedToken = await verifyAuth(request);
//   if (!('uid' in decodedToken)) {
//     return decodedToken;
//   }

//   const { messageId, roomId, content, editedAt } = await request.json();

//   const batch = db.batch();

//   // Get the message to verify ownership
//   const messageRef = db.collection('chatRooms').doc(roomId)
//     .collection('messages').doc(messageId);
//   const messageDoc = await messageRef.get();

//   if (!messageDoc.exists) {
//     return NextResponse.json({ error: 'Message not found' }, { status: 404 });
//   }

//   const messageData = messageDoc.data();
//   if (messageData?.senderId !== decodedToken.uid) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//   }

//   // Update the message
//   batch.update(messageRef, {
//     content,
//     edited: editedAt
//   });

//   // Commit the batch
//   await batch.commit();

//   return NextResponse.json({ status: 'ok' });
// }










// app/api/chat/edit/route.ts
import { db } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { messageId, roomId, content, editedAt } = await request.json();

    const batch = db.batch();

    // Get the message to verify ownership
    const messageRef = db.collection('chatRooms').doc(roomId)
      .collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return NextResponse.json(
        { error: 'Message not found' }, 
        { status: 404 }
      );
    }

    const messageData = messageDoc.data();
    if (messageData?.senderId !== payload.uid) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 403 }
      );
    }

    // Update the message
    batch.update(messageRef, {
      content,
      edited: editedAt
    });

    await batch.commit();
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Edit message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}