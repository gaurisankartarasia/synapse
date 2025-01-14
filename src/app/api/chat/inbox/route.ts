// // src/app/api/messages/route.ts
// import { NextResponse } from 'next/server';
// import { auth } from '@/lib/firebaseAdmin';
// import { db } from '@/lib/firebaseClient';
// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs, 
//   orderBy,
//   limit // Add this import
// } from 'firebase/firestore';

// export async function GET(request: Request) {
//   try {
//     // Get the authorization token from the header
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split('Bearer ')[1];
    
//     // Verify the token
//     const decodedToken = await auth.verifyIdToken(token);
//     const userId = decodedToken.uid;

//     // Fetch chat rooms
//     const chatRoomsQuery = query(
//       collection(db, 'chatRooms'),
//       where('participants', 'array-contains', userId)
//     );

//     const chatRoomsSnapshot = await getDocs(chatRoomsQuery);
    
//     // Process chat rooms and fetch messages
//     const chatRoomsPromises = chatRoomsSnapshot.docs.map(async (roomDoc) => {
//       const roomData = roomDoc.data();
//       const otherUserId = roomData.participants.find((id: string) => id !== userId);

//       // Get other user's data
//       const otherUserDoc = await getDocs(
//         query(collection(db, 'users'), where('uid', '==', otherUserId))
//       );

//       // Get latest messages with proper pagination
//       const messagesQuery = query(
//         collection(db, 'chatRooms', roomDoc.id, 'messages'),
//         orderBy('timestamp', 'desc'),
//         limit(1) // Get only the latest message
//       );
      
//       const messagesSnapshot = await getDocs(messagesQuery);
//       const lastMessage = messagesSnapshot.docs[0]?.data() || null;

//       return {
//         id: roomDoc.id,
//         participants: roomData.participants,
//         participantKey: roomData.participantKey,
//         lastMessage,
//         otherUser: otherUserDoc.docs[0]?.data() || { displayName: 'Unknown User' }
//       };
//     });

//     const chatRooms = await Promise.all(chatRoomsPromises);

//     return NextResponse.json({ chatRooms });
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch messages' },
//       { status: 500 }
//     );
//   }
// }















import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    // Get and verify the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    try {
      // Use admin SDK to fetch chat rooms
      const chatRoomsSnapshot = await db
        .collection('chatRooms')
        .where('participants', 'array-contains', userId)
        .get();

      if (chatRoomsSnapshot.empty) {
        return NextResponse.json({ chatRooms: [] });
      }

      // Process chat rooms and fetch messages
      const chatRoomsPromises = chatRoomsSnapshot.docs.map(async (roomDoc) => {
        const roomData = roomDoc.data();
        const otherUserId = roomData.participants.find((id: string) => id !== userId);

        // Get other user's data
        const otherUserDoc = await db
          .collection('users')
          .doc(otherUserId)
          .get();

        const otherUserData = otherUserDoc.data() || { displayName: 'Unknown User' };

        // Get latest message
        const messagesSnapshot = await db
          .collection('chatRooms')
          .doc(roomDoc.id)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        const lastMessage = !messagesSnapshot.empty ? {
          content: messagesSnapshot.docs[0].data().content,
          timestamp: messagesSnapshot.docs[0].data().timestamp.toMillis(),
          senderId: messagesSnapshot.docs[0].data().senderId
        } : null;

        return {
          id: roomDoc.id,
          participants: roomData.participants,
          participantKey: roomData.participantKey || '',
          lastMessage,
          otherUser: {
            displayName: otherUserData.displayName || 'Unknown User',
            uid: otherUserId
          }
        };
      });

      const chatRooms = await Promise.all(chatRoomsPromises);
      return NextResponse.json({ chatRooms });

    } catch (error) {
      console.error('Firebase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}