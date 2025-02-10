

 // app/api/post/create/route.ts

import { db, FieldValue } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: NextRequest) {
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

    const uid = payload.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { username } = userDoc.data() || {};
    if (!username) {
      return NextResponse.json({ error: "Username not found" }, { status: 400 });
    }

    const body = await request.json();
    const { content, imageURLs, hashtags, allow_commenting } = body;

    const createdAt = FieldValue.serverTimestamp();
    
    const batch = db.batch();
    const newPostRef = db.collection("posts").doc();

    // Update post document to include title, hashtags, and author
    batch.set(newPostRef, {
      uid,
      content,
      author: username,
      createdAt,
      imageURLs: imageURLs || [],
      hashtags: hashtags || [],
      allow_commenting: allow_commenting ?? true,
      comment_count: 0
    });

    // Add hashtags to a separate collection for easy querying
    if (hashtags && hashtags.length > 0) {
      hashtags.forEach(async (tag: string) => {
        const hashtagRef = db.collection("hashtags").doc(tag.toLowerCase());
        batch.set(hashtagRef, {
          count: FieldValue.increment(1),
          posts: FieldValue.arrayUnion(newPostRef.id)
        }, { merge: true });
      });
    }

    await batch.commit();

    return NextResponse.json({ 
      message: "Post saved successfully!", 
      postId: newPostRef.id 
    });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Failed to save post." }, { status: 500 });
  }
}




