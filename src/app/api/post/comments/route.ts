
// app/api/post/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postDoc = await db.collection("posts").doc(postId).get();
    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = postDoc.data()?.comments || [];
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
    }

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postRef = db.collection("posts").doc(postId);
    const newComment = {
      id: Date.now().toString(), // Use timestamp as ID for simplicity
      authorId: user.uid,
      content,
      author: user.name || user.uid,
      createdAt: getFormattedDate(),
      likes: 0,
      likedBy: []
    };

    // Add comment to post document
    await postRef.update({
      comments: FieldValue.arrayUnion(newComment),
      commentCount: FieldValue.increment(1)
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}