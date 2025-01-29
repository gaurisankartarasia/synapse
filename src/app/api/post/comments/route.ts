
// app/api/post/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postRef = db.collection("posts").doc(postId);
    const commentsRef = postRef.collection("comments");

    // Fetch comments sorted by createdAt (newest first)
    const commentsSnapshot = await commentsRef.orderBy("createdAt", "desc").get();

    if (commentsSnapshot.empty) {
      return NextResponse.json({ comments: [] }, { status: 200 });
    }

    const comments = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json(
        { error: "Post ID and content are required" },
        { status: 400 }
      );
    }

    // Fetch the username from the users collection
    const userDoc = await db.collection("users").doc(payload.uid).get();
    const username = userDoc.exists ? userDoc.data()?.username : null;

    const postRef = db.collection("posts").doc(postId);
    const commentsRef = postRef.collection("comments");

    // Create a new document with an auto-generated ID
    const newCommentRef = commentsRef.doc();
    const commentId = newCommentRef.id; // Get the auto-generated ID

    // Prepare the new comment
    const newComment = {
      id: commentId, // Use Firestore-generated ID
      authorId: payload.uid,
      content,
      author: username || payload.uid,
      createdAt: FieldValue.serverTimestamp(),
      likes: 0,
      likedBy: [],
    };

    // Start a write batch
    const batch = db.batch();
    batch.set(newCommentRef, newComment);
    batch.update(postRef, {
      commentCount: FieldValue.increment(1),
    });

    // Commit the batch write
    await batch.commit();

    // Fetch the saved comment with the actual timestamp
    const savedComment = await newCommentRef.get();
    const commentData = savedComment.data();

    return NextResponse.json(commentData, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
