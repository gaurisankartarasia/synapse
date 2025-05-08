
// app/api/v1/user/posts/route.ts
import { db } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function GET(request: Request) {
  try {
    // Get and verify JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Please signin to view posts' },
        { status: 401 }
      );
    }

    // Verify JWT token and get requesting user's ID
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    const requestingUid = payload.uid;

    if (!requestingUid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Get target user ID from query params
    const { searchParams } = new URL(request.url);
    const targetUid = searchParams.get('uid');
    
    if (!targetUid) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }

    // Check if the target user's profile is private
    const targetUserDoc = await db.collection('users').doc(targetUid).get();
    const targetUserData = targetUserDoc.data();
    
    if (!targetUserDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isPrivate = targetUserData?.isPrivate;
    
    // Check if requesting user is following the target user
    const isFollowing = (
      await db
        .collection('users')
        .doc(targetUid)
        .collection('followers')
        .doc(requestingUid)
        .get()
    ).exists;

    // If profile is private and user is not following and not their own profile
    if (isPrivate && !isFollowing && requestingUid !== targetUid) {
      return NextResponse.json(
        { message: "This user's posts are private" },
        { status: 403 }
      );
    }

    // Fetch posts if authorized
    const postsRef = db.collection('posts');
    const snapshot = await postsRef
      .where('creator_uid', '==', targetUid)
      // .orderBy('createdAt', 'desc') // Uncomment if you have the proper index
      .get();

    const posts = snapshot.docs.map(doc => ({
      postId: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ 
      
      posts: posts || [] ,
      status: 'ok'

    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    console.error('Error fetching posts:', errorMessage);
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      }, 
      { status: 500 }
    );
  }
}