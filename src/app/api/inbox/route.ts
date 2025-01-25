// src/app/api/chats/route.ts
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Unauthorized');

    const decoded = await verifyJWT(token);
    const userId = decoded.uid;

    const chatRooms = await db.collection('chatRooms')
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTimestamp', 'desc')
      .get();

    const chats = await Promise.all(chatRooms.docs.map(async doc => {
      const data = doc.data();
      const otherParticipantId = data.participants.find((id: string) => id !== userId);
      const userDoc = await db.collection('users').doc(otherParticipantId).get();
      const userData = userDoc.data();

      return {
        id: doc.id,
        otherParticipant: {
          id: otherParticipantId,
          name: userData?.name || 'Unknown',
          avatar: userData?.photoURL || '',
        },
        lastMessage: data.lastMessage || '',
        lastMessageTimestamp: data.lastMessageTimestamp?.toDate() || new Date(),
        unreadCount: data.unreadCounts?.[userId] || 0,
        isRead: data.lastMessageSender === userId
      };
    }));

    return NextResponse.json(chats);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}