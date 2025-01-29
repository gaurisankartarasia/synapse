
// app/api/post/comments/[commentId]/replies/[replyId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string; replyId: string } }
) {
  try {
    const { postId } = await request.json();
    const { commentId, replyId } = params;

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

    const postRef = db.collection("posts").doc(postId);
    const replyRef = postRef
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .doc(replyId);

    // Using a transaction to ensure atomicity and avoid race conditions
    await db.runTransaction(async (transaction) => {
      const replyDoc = await transaction.get(replyRef);
      if (!replyDoc.exists) {
        throw new Error("Reply not found");
      }

      const likedByRef = replyRef.collection("likes").doc(payload.uid);
      const likedByDoc = await transaction.get(likedByRef);

      // Check if the user has already liked the reply
      const hasLiked = likedByDoc.exists;

      // If the user has liked the reply, we un-like it
      if (hasLiked) {
        transaction.delete(likedByRef); // Remove the like
        transaction.update(replyRef, { likes: FieldValue.increment(-1) }); // Decrement like count
      } else {
        // Otherwise, we add a like
        transaction.set(likedByRef, { userId: payload.uid });
        transaction.update(replyRef, { likes: FieldValue.increment(1) }); // Increment like count
      }
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error liking reply:", error);
    return NextResponse.json({ error: "Failed to like reply" }, { status: 500 });
  }
}
