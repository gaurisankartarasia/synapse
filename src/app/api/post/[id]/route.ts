

// import { db } from "@/lib/firebaseAdmin";
// import { NextResponse, NextRequest } from "next/server";
// import { cache } from "react";

// // Cache the batch read operation for the posts
// const getPostsFromDb = cache(async (ids: string[]) => {
//   // Create references for all post documents based on the provided ids
//   const postRefs = ids.map(id => db.collection("posts").doc(id));
//   // Fetch all documents in a single batch read
//   const postDocs = await db.getAll(...postRefs);
//   return postDocs;
// });

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export async function GET(request: NextRequest, { params }: Props) {
//   try {
//     const resolvedParams = await params; // Resolve the params promise
//     const { id } = resolvedParams;
    
//     const headers = {
//       "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
//       "Content-Type": "application/json",
//     };

//     // Fetch post documents in a batch read operation
//     const postDocs = await getPostsFromDb([id]); // Pass an array of ids

//     // Assuming we're only expecting one post document based on the id
//     const postDoc = postDocs[0]; 

//     if (!postDoc.exists) {
//       return NextResponse.json(
//         { error: "Post not found" },
//         { status: 404, headers }
//       );
//     }

//     const postData = postDoc.data();
//     if (!postData) {
//       return NextResponse.json(
//         { error: "Post data is missing" },
//         { status: 404, headers }
//       );
//     }

//     const { uid, title, content, author, createdAt, imageUrls } = postData;
//     return NextResponse.json(
//       {
//         uid,
//         id,
//         title,
//         content,
//         author,
//         createdAt,
//              imageUrls: imageUrls || [],
//       },
//       { headers }
//     );
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch post." },
//       { status: 500 }
//     );
//   }
// }










import { db } from "@/lib/firebaseAdmin";
import { NextResponse, NextRequest } from "next/server";
import { cache } from "react";

interface FirestorePost {
  uid: string;
  title: string;
  content: string;
  imageUrls: string[];
  createdAt: FirebaseFirestore.Timestamp;
  likes: number;
  commentCount: number;
}

interface FirestoreUser {
  username?: string;
  // Add other user fields if needed
}

// Cache the batch read operation for the posts
const getPostsFromDb = cache(async (ids: string[]) => {
  const postRefs = ids.map(id => db.collection("posts").doc(id));
  const postDocs = await db.getAll(...postRefs);
  return postDocs;
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const headers = {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Content-Type": "application/json",
    };

    // Fetch post document
    const postDocs = await getPostsFromDb([id]);
    const postDoc = postDocs[0];

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers }
      );
    }

    const postData = postDoc.data() as FirestorePost;
    if (!postData) {
      return NextResponse.json(
        { error: "Post data is missing" },
        { status: 404, headers }
      );
    }

    // Fetch user document
    const userDoc = await db.collection('users').doc(postData.uid).get();
    const userData = userDoc.data() as FirestoreUser | undefined;
    
    // Get username or default to 'Unknown'
    const authorName = userData?.username || 'Unknown';

    // Format response data
    const responseData = {
      uid: postData.uid,
      id,
      title: postData.title,
      content: postData.content,
      author: authorName,
      createdAt: postData.createdAt,
      imageUrls: postData.imageUrls || [],
      likes: postData.likes || 0,
      commentCount: postData.commentCount || 0
    };

    return NextResponse.json(responseData, { headers });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }
}