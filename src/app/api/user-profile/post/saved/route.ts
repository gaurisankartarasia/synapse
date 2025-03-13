// app/api/user/posts/saved/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function GET(request: NextRequest) {
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

    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    // Ensure the user is requesting their own saved posts
    if (uid !== payload.uid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const userRef = db.collection('users').doc(uid);
    const savedPostsRef = userRef.collection('saved_posts');
    
    // Get all saved posts
    const savedPostsSnapshot = await savedPostsRef.orderBy('savedAt', 'desc').get();
    
    // Get the actual post data for each saved post
    const postPromises = savedPostsSnapshot.docs.map(async (doc) => {
      const postId = doc.data().postId;
      const postDoc = await db.collection('posts').doc(postId).get();
      
      if (!postDoc.exists) return null;
      
      return {
        postId: postDoc.id,
        ...postDoc.data()
      };
    });

    const posts = (await Promise.all(postPromises)).filter(post => post !== null);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved posts." },
      { status: 500 }
    );
  }
}