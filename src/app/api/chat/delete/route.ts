
// // app/api/chat/delete/route.ts
// import { db } from '@/lib/firebaseAdmin';
// import { verifyAuth } from '@/utils/auth';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   const decodedToken = await verifyAuth(request);
//   if (!('uid' in decodedToken)) {
//     return decodedToken;
//   }

//   const { messageId, roomId, deleteType } = await request.json();
  
//   const messageRef = db.collection('chatRooms').doc(roomId)
//     .collection('messages').doc(messageId);

//   const messageDoc = await messageRef.get();
//   if (!messageDoc.exists) {
//     return NextResponse.json({ error: 'Message not found' }, { status: 404 });
//   }

//   const messageData = messageDoc.data();
//   const currentDeletedFor = messageData?.deletedFor || [];

//   if (deleteType === 'everyone') {
//     if (messageData?.senderId !== decodedToken.uid) {
//       return NextResponse.json(
//         { error: 'Unauthorized to delete this message for everyone' },
//         { status: 403 }
//       );
//     }
    
//     await messageRef.update({
//       deletedForEveryone: true,
//       content: 'This message was deleted',
//       deletedAt: Date.now()
//     });
//   } else {
//     if (!currentDeletedFor.includes(decodedToken.uid)) {
//       await messageRef.update({
//         deletedFor: [...currentDeletedFor, decodedToken.uid]
//       });
//     }
//   }

//   return NextResponse.json({ status: 'ok' });
// }













// app/api/chat/delete/route.ts
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

    const { messageId, roomId, deleteType } = await request.json();
    
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
    const currentDeletedFor = messageData?.deletedFor || [];

    if (deleteType === 'everyone') {
      if (messageData?.senderId !== payload.uid) {
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
      if (!currentDeletedFor.includes(payload.uid)) {
        await messageRef.update({
          deletedFor: [...currentDeletedFor, payload.uid]
        });
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
