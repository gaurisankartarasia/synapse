import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";
import { FieldValue } from "firebase-admin/firestore";

// app/api/post/comments/[commentId]/replies/[replyId]/route.ts
export async function DELETE(
    request: NextRequest,
    { params }: { params: { commentId: string; replyId: string } }
  ) {
    try {
      const { postId } = await request.json();
      const { commentId, replyId } = params;
  
      const user = await verifyAuth(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const postRef = db.collection("posts").doc(postId);
      const postDoc = await postRef.get();
      const post = postDoc.data();
  
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
      const comments = post.comments.map((comment: any) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply: any) => reply.id !== replyId)
          };
        }
        return comment;
      });
  
      await postRef.update({ comments });
  
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error deleting reply:", error);
      return NextResponse.json(
        { error: "Failed to delete reply" },
        { status: 500 }
      );
    }
  }
  