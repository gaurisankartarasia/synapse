

// app/api/post/comments/[commentId]/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
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

    const { postId, content } = await request.json();
    const { commentId } = params;

    if (!postId || !content || !commentId) {
      return NextResponse.json(
        { error: "Post ID, comment ID, and content are required" },
        { status: 400 }
      );
    }

    // Fetch user data for the author name
    const userDoc = await db.collection("users").doc(payload.uid).get();
    const username = userDoc.exists ? userDoc.data()?.username : null;

    // Reference to the comment and replies collection
    const commentRef = db.collection("posts").doc(postId).collection("comments").doc(commentId);
    const repliesRef = commentRef.collection("replies");
    
    // Create a new reply document
    const newReplyRef = repliesRef.doc(); // Auto-generate ID
    const newReply = {
      id: newReplyRef.id, // Use Firestore-generated ID
      authorId: payload.uid,
      author: username || payload.uid,
      content,
      createdAt: FieldValue.serverTimestamp(),
      likes: 0,
      replyCount: 0, // To support nested replies in future if needed
    };

    // Run transaction to add reply and update reply count
    await db.runTransaction(async (transaction) => {
      const commentDoc = await transaction.get(commentRef);
      if (!commentDoc.exists) {
        throw new Error("Comment not found");
      }

      transaction.set(newReplyRef, newReply);
      transaction.update(commentRef, {
        replyCount: FieldValue.increment(1),
      });
    });

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
  }
}
