

// app/api/post/comments/[commentId]/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { postId, content } = await request.json();
    const { commentId } = params;

    if (!postId || !content || !commentId) {
      return NextResponse.json(
        { error: "Post ID, comment ID, and content are required" },
        { status: 400 }
      );
    }

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newReply = {
      id: Date.now().toString(),
      authorId: user.uid,
      author: user.name || user.uid,
      content,
      createdAt: getFormattedDate(),
      likes: 0,
      likedBy: [],
    };

    // Reference to the post document
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postData = postDoc.data();
    const comments = postData?.comments || [];

    // Find the comment and add the reply
    const updatedComments = comments.map((comment: any) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      return comment;
    });

    // Update the comments in the database
    await postRef.update({
      comments: updatedComments,
    });

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
