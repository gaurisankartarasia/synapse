


// app/api/post/display/route.ts
import { db } from "../../../../lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const POSTS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const lastPostId = url.searchParams.get('lastPostId');
    let query = db.collection("posts").orderBy("createdAt", "desc");

    // If we have a last post ID, start after that post
    if (lastPostId) {
      const lastDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    // Limit the number of posts per request
    query = query.limit(POSTS_PER_PAGE);

    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Cache the response for 1 minute
    return new NextResponse(JSON.stringify({ posts }), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}




