// app/api/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = params.commentId;
    const commentRef = db.collection("comments").doc(commentId);
    const comment = await commentRef.get();

    if (!comment.exists) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const commentData = comment.data();
    
    // Verify ownership
    if (commentData?.authorId !== user.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await commentRef.delete();
    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}