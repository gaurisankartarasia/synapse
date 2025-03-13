import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token.value);
    const uid = payload.uid;

    if (!uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch liked posts
    let likesQuery = db.collectionGroup('likes')
      .where('uid', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(10);

    const likesSnapshot = await likesQuery.get();
    if (likesSnapshot.empty) {
      return NextResponse.json({ posts: [] });
    }

    const postIds = likesSnapshot.docs.map(doc => doc.ref.parent?.parent?.id).filter(id => id);

    const postsSnapshot = await db.collection('posts')
      .where('__name__', 'in', postIds)
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      postId: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Error fetching liked posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
