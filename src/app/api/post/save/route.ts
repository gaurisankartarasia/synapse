// app/api/post/save/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore =  await cookies();
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

    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(payload.uid);
    const savedPostsRef = userRef.collection('saved_posts');
    
    // Check if post is already saved
    const savedPostDoc = await savedPostsRef.doc(postId).get();
    
    if (savedPostDoc.exists) {
      // Unsave the post
      await savedPostsRef.doc(postId).delete();
      return NextResponse.json({ saved: false });
    } else {
      // Save the post
      await savedPostsRef.doc(postId).set({
        savedAt: new Date(),
        postId: postId
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Error toggling save status:", error);
    return NextResponse.json(
      { error: "Failed to toggle save status." },
      { status: 500 }
    );
  }
}
