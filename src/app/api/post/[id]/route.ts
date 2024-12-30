
// app/api/post/[id]/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cache } from 'react';


const getPostFromDb = cache(async (id: string) =>   {

        const postDoc = await db.collection("posts").doc(id).get();

  return postDoc;
  
});



export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Content-Type': 'application/json',
    };

    const postDoc = await getPostFromDb(params.id);

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers }
      );
    }

    const postData = postDoc.data();
    if (!postData) {
      return NextResponse.json(
        { error: "Post data is missing" },
        { status: 404, headers }
      );
    }

    // Convert Firestore timestamp to seconds/nanoseconds format
    const { uid, title, content, author, createdAt, imageUrls } = postData;
    
    return NextResponse.json({
      uid,
      id: params.id,
      title,
      content,
      author,
      createdAt: {
        seconds: createdAt._seconds || createdAt.seconds,
        nanoseconds: createdAt._nanoseconds || createdAt.nanoseconds
      },
      imageUrls: imageUrls || [],
    }, { headers });

  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }
}
