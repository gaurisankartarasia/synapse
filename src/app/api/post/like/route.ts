

// app/api/post/like/route.ts
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
// import { FieldValue } from "firebase-admin/firestore";

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
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postRef = db.collection("posts").doc(postId);
    const likesRef = postRef.collection("likes").doc(uid);

    // Use a transaction to ensure atomic updates
    const result = await db.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      
      if (!postDoc.exists) {
        throw new Error("Post not found");
      }

      const like_count = postDoc.data()?.like_count || 0;
      const hasLiked = (await transaction.get(likesRef)).exists;

      if (hasLiked) {
        // Unlike: Remove like document and decrement like count
        transaction.delete(likesRef);
        transaction.update(postRef, { like_count: FieldValue.increment(-1) });
        
        return { liked: false, total: like_count - 1 };
      } else {
        // Like: Add like document and increment like count
        transaction.set(likesRef, {
          uid: payload.uid,
          createdAt: FieldValue.serverTimestamp(),
        });
        transaction.update(postRef, { like_count: FieldValue.increment(1) });

        return { liked: true, total: like_count + 1 };
      }
    });

    return NextResponse.json({
      status: 'ok', 
    });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
  }
}

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

    const uid = payload.uid;
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postDoc = await db.collection("posts").doc(postId).get();
    const like_count = postDoc.data()?.like_count || 0;
    const likesRef = db.collection("posts").doc(postId).collection("likes").doc(uid);
    const hasLiked = (await likesRef.get()).exists;
    
    return NextResponse.json({ 
      liked: hasLiked,
      total: like_count
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
}
