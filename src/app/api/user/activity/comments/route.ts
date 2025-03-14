import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const lastTimestamp = searchParams.get('lastTimestamp');
    const limit = 10;

    // Build the query
    let commentsQuery = db.collectionGroup('comments')
      .where('uid', '==', payload.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    // If lastTimestamp is provided, use it for pagination
    if (lastTimestamp) {
      const timestamp = new Timestamp(
        Math.floor(parseInt(lastTimestamp) / 1000),
        (parseInt(lastTimestamp) % 1000) * 1000000
      );
      commentsQuery = commentsQuery.startAfter(timestamp);
    }

    // Execute the query
    const commentsSnapshot = await commentsQuery.get();
    
    // Transform the data
    const comments = await Promise.all(commentsSnapshot.docs.map(async (doc) => {
      const commentData = doc.data();
      
      // Get user data for each comment
      const userDoc = await db.collection('users').doc(commentData.uid).get();
      const userData = userDoc.data();

      return {
        id: doc.id,
        postId: commentData.postId,
        uid: commentData.uid,
        content: commentData.content,
        createdAt: commentData.createdAt.toDate().getTime(), // Convert to milliseconds timestamp
        likes: commentData.likes || 0,
        user: {
          username: userData?.username || 'anonymous',
          profilePhotoURL: userData?.profilePhotoURL || null,
          displayName: userData?.displayName || 'Unknown User',
          isVerified: userData?.isVerified || false,
          isPrivate: userData?.isPrivate || false,
        }
      };
    }));

    // Get the last timestamp for pagination
    const lastDoc = commentsSnapshot.docs[commentsSnapshot.docs.length - 1];
    const hasMore = commentsSnapshot.docs.length === limit;
    const lastCreatedAt = hasMore && lastDoc ? lastDoc.data().createdAt.toDate().getTime() : null;

    return NextResponse.json({
      comments,
      hasMore,
      lastTimestamp: lastCreatedAt
    });
    
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


