

import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await context.params;
    const decodedTag = decodeURIComponent(tag).toLowerCase();
    const { searchParams } = request.nextUrl;
    const lastPostId = searchParams.get("lastPostId");

    console.log(`Fetching posts for hashtag: ${decodedTag}`);

    let query = db.collection("posts").where("hashtags", "array-contains", decodedTag);

    if (lastPostId) {
      const lastPostDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastPostDoc.exists) {
        query = query.startAfter(lastPostDoc);
      }
    }

    const postsSnapshot = await query.limit(5).get();
    const posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const creator_uid = data.creator_uid;

        // Fetch user profile directly within the post mapping
        let userProfile = null;
        if (creator_uid) {
          const userDoc = await db.collection("users").doc(creator_uid).get();
          if (userDoc.exists) {
            userProfile = userDoc.data();
          }
        }

        return {
          postId: doc.id,
          ...data,
          user: userProfile, // Include user profile in each post
        };
      })
    );

    console.log(`Found ${posts.length} posts for hashtag: ${decodedTag}`);

    return NextResponse.json({
      posts,
      hasMore: posts.length === 5,
    });
  } catch (error) {
    console.error("Error fetching hashtag posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch posts.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


