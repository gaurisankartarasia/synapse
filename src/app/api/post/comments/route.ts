//app/api/post/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // Firestore admin instance
import { verifyAuth } from "@/utils/auth"; // Authentication utility
import { getFormattedDate } from "@/utils/formatDate"; // Date formatting utility



// GET handler for fetching comments
export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "post ID is required" }, { status: 400 });
    }

    const snapshot = await db.collection("comments").where("postId", "==", postId).get();
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST handler for adding a new comment
export async function POST(request: NextRequest) {
  try {
    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json({ error: "post ID and content are required" }, { status: 400 });
    }

    const user = await verifyAuth(request); // Verify Firebase authentication
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newComment = {
      uid:user.uid,
      postId,
      content,
      author: user.uid,
      createdAt: getFormattedDate(), // Save formatted local time
    };

    const docRef = await db.collection("comments").add(newComment);
    const savedComment = { id: docRef.id, ...newComment };

    return NextResponse.json(savedComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}


