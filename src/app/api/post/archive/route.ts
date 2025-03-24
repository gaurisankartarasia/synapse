// app/api/post/archive/route.ts
import { db } from "@/lib/firebaseAdmin";
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

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const postData = postDoc.data();

    if (postData?.creator_uid !== payload.uid) {
      return NextResponse.json(
        { error: 'You are not authorized to archive this post' },
        { status: 403 }
      );
    }

    const isArchived = postData?.isArchived || false;

    await postRef.update({
      isArchived: !isArchived,
    });

    return NextResponse.json({ archived: !isArchived });

  } catch (error) {
    console.error("Error toggling archive status:", error);
    return NextResponse.json(
      { error: "Failed to toggle archive status." },
      { status: 500 }
    );
  }
}