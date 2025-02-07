// // src/app/api/chats/[userId]/read/route.ts
// import { NextResponse } from 'next/server';
// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin';
// import { cookies } from 'next/headers';

// export async function POST(
//   request: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token')?.value;
//     if (!token) throw new Error('Unauthorized');

//     const decoded = await verifyJWT(token);
//     const currentUserId = decoded.uid;
//     const otherUserId = params.userId;

//     const chatRooms = await db.collection('chatRooms')
//       .where('participants', 'array-contains', currentUserId)
//       .where('participants', 'array-contains', otherUserId)
//       .limit(1)
//       .get();

//     if (chatRooms.empty) {
//       return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
//     }

//     const roomRef = chatRooms.docs[0].ref;
//     await roomRef.update({
//       [`unreadCounts.${currentUserId}`]: 0
//     });

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Server error' },
//       { status: 500 }
//     );
//   }
// }






import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Unauthorized');

    const decoded = await verifyJWT(token);
    const currentUserId = decoded.uid;
    
    // Await the params promise
    const { userId: otherUserId } = await context.params;

    const chatRooms = await db.collection('chatRooms')
      .where('participants', 'array-contains', currentUserId)
      .where('participants', 'array-contains', otherUserId)
      .limit(1)
      .get();

    if (chatRooms.empty) {
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
    }

    const roomRef = chatRooms.docs[0].ref;
    await roomRef.update({
      [`unreadCounts.${currentUserId}`]: 0
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
