
// app/api/comments/[commentId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await verifyAuth(request);
    const commentId = params.commentId;
    
    const commentRef = db.collection("comments").doc(commentId);
    const commentDoc = await commentRef.get();
    
    if (!commentDoc.exists) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    
    const comment = commentDoc.data();
    const likedBy = comment?.likedBy || [];
    const userIndex = likedBy.indexOf(user.uid);
    
    if (userIndex === -1) {
      // Add like
      await commentRef.update({
        likes: (comment?.likes || 0) + 1,
        likedBy: [...likedBy, user.uid],
      });
    } else {
      // Remove like
      likedBy.splice(userIndex, 1);
      await commentRef.update({
        likes: (comment?.likes || 0) - 1,
        likedBy,
      });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
  }
}





