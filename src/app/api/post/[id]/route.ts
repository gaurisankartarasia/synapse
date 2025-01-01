
// // app/api/post/[id]/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextResponse, NextRequest } from "next/server";
// import { cache } from "react";

// const getPostFromDb = cache(async (id: string) => {
//   const postDoc = await db.collection("posts").doc(id).get();
//   return postDoc;
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

//     const postDoc = await getPostFromDb(id);

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
//         createdAt: {
//           seconds: createdAt._seconds || createdAt.seconds,
//           nanoseconds: createdAt._nanoseconds || createdAt.nanoseconds,
//         },
//         imageUrls: imageUrls || [],
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

// Cache the batch read operation for the posts
const getPostsFromDb = cache(async (ids: string[]) => {
  // Create references for all post documents based on the provided ids
  const postRefs = ids.map(id => db.collection("posts").doc(id));
  // Fetch all documents in a single batch read
  const postDocs = await db.getAll(...postRefs);
  return postDocs;
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params; // Resolve the params promise
    const { id } = resolvedParams;
    
    const headers = {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Content-Type": "application/json",
    };

    // Fetch post documents in a batch read operation
    const postDocs = await getPostsFromDb([id]); // Pass an array of ids

    // Assuming we're only expecting one post document based on the id
    const postDoc = postDocs[0]; 

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

    const { uid, title, content, author, createdAt, imageUrls } = postData;
    return NextResponse.json(
      {
        uid,
        id,
        title,
        content,
        author,
        createdAt: {
          seconds: createdAt._seconds || createdAt.seconds,
          nanoseconds: createdAt._nanoseconds || createdAt.nanoseconds,
        },
        imageUrls: imageUrls || [],
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }
}
