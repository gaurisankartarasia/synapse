
// app/api/post/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
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

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postRef = db.collection("posts").doc(postId);
    const commentRef = postRef.collection("comments").doc(params.commentId);

    // Fetch the comment to verify ownership
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const commentData = commentDoc.data();

    if (commentData?.uid !== payload.uid) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Start batch operation
    const batch = db.batch();
    batch.delete(commentRef);
    batch.update(postRef, {
      commentCount: FieldValue.increment(-1),
    });

    // Commit batch delete
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
