// app/api/posts/route.ts
import { db } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }

    const postsRef = db.collection('posts');
    const snapshot = await postsRef
      .where('uid', '==', uid)
    //   .orderBy('createdAt', 'desc')
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Safely handle date conversion
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    // Ensure we're returning a valid object
    return NextResponse.json({ 
      success: true,
      posts: posts || [] 
    });

  } catch (error) {
    // Properly format error response
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





