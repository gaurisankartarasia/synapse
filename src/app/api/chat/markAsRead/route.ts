import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

// app/api/chat/markAsRead/route.ts
export async function POST(request: NextRequest) {
    const decodedToken = await verifyAuth(request);
    if (!('uid' in decodedToken)) return decodedToken;
  
    const { roomId } = await request.json();
    
    const roomRef = db.collection('chatRooms').doc(roomId);
    const roomDoc = await roomRef.get();
    
    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
  
    const batch = db.batch();
    
    // Update unread count
    batch.update(roomRef, {
      [`unreadCounts.${decodedToken.uid}`]: 0
    });
  
    // Get unread messages not sent by current user
    const messagesSnapshot = await db.collection(`chatRooms/${roomId}/messages`)
      .where('senderId', '!=', decodedToken.uid)
      .get();
  
    messagesSnapshot.docs.forEach(doc => {
      const currentReadBy = doc.data().readBy || [];
      if (!currentReadBy.includes(decodedToken.uid)) {
        batch.update(doc.ref, {
          readBy: [...currentReadBy, decodedToken.uid]
        });
      }
    });
  
    await batch.commit();
    return NextResponse.json({ status: 'ok' });
  }