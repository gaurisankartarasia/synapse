// app/api/post/comments/[commentId]/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
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
            replies: comment.replies.map((reply: any) => {
              if (reply.id === replyId) {
                const isLiked = reply.likedBy?.includes(user.uid);
                return {
                  ...reply,
                  likes: isLiked ? reply.likes - 1 : reply.likes + 1,
                  likedBy: isLiked
                    ? reply.likedBy.filter((id: string) => id !== user.uid)
                    : [...(reply.likedBy || []), user.uid]
                };
              }
              return reply;
            })
          };
        }
        return comment;
      });
  
      await postRef.update({ comments });
  
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error liking reply:", error);
      return NextResponse.json(
        { error: "Failed to like reply" },
        { status: 500 }
      );
    }
  }