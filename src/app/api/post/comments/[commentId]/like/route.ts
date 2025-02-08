
// app/api/comments/[commentId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
   context: { params: Promise< { commentId: string }> }) {
  try {

    const { commentId } = await context.params;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and type assert the payload
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const commentRef = db.collection("posts").doc(postId).collection("comments").doc(commentId);
    const likeRef = commentRef.collection("likes").doc(payload.uid);

    await db.runTransaction(async (transaction) => {
      const likeDoc = await transaction.get(likeRef);
      const commentDoc = await transaction.get(commentRef);

      if (!commentDoc.exists) {
        throw new Error("Comment not found");
      }

      if (likeDoc.exists) {
        // If already liked, unlike it
        transaction.delete(likeRef);
        transaction.update(commentRef, {
          likes: FieldValue.increment(-1),
        });
      } else {
        // If not liked, add like
        transaction.set(likeRef, { uid: payload.uid, created_at: FieldValue.serverTimestamp() });
        transaction.update(commentRef, {
          likes: FieldValue.increment(1),
        });
      }
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
  }
}
