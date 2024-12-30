// app/api/post/like/likedby/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/utils/auth";
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postDoc = await db.collection("posts").doc(postId).get();
    const likesData = postDoc.data()?.likes?.userLikes || {};

    // Get user details for each like
    const userPromises = Object.entries(likesData).map(async ([uid, timestamp]) => {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data();
      
      return {
        uid,
        username: userData?.username || "Unknown User",
        profilePic: userData?.photoURL || "/default.webp",
        timestamp: timestamp as Timestamp
      };
    });

    const users = await Promise.all(userPromises);
    
    // Sort by most recent likes first
    users.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    return NextResponse.json({ 
      users: users.map(user => ({
        ...user,
        timestamp: user.timestamp.toDate().toISOString()
      }))
    });
  } catch (error) {
    console.error("Error fetching likes users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
