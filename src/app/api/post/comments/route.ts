

// // app/api/post/comments/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";
// import { getFormattedDate } from "@/utils/formatDate";
// import { FieldValue } from "firebase-admin/firestore";

// // GET handler - optimized for read efficiency
// export async function GET(request: NextRequest) {
//   try {
//     const postId = request.nextUrl.searchParams.get("postId");
//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     // Fetch only the comments array and post existence check in one call
//     const postDoc = await db.collection("posts").doc(postId).get();
//     if (!postDoc.exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const comments = postDoc.data()?.comments || [];
//     return NextResponse.json({ comments }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
//   }
// }

// // POST handler - optimized to reduce unnecessary reads
// export async function POST(request: NextRequest) {
//   try {
//     const { postId, content } = await request.json();
//     if (!postId || !content) {
//       return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
//     }

//     const user = await verifyAuth(request);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Fetch the username from the users collection once per user session
//     const userDoc = await db.collection("users").doc(user.uid).get();
//     const username = userDoc.exists ? userDoc.data()?.username : null;

//     const postRef = db.collection("posts").doc(postId);

//     // Prepare the new comment
//     const newComment = {
//       id: Date.now().toString(), 
//       authorId: user.uid,
//       content,
//       author: username || user.uid, // Use username fetched from users collection
//       createdAt: getFormattedDate(),
//       likes: 0,
//       likedBy: []
//     };

//     // Using a single update to add the comment and increment the comment count
//     await postRef.update({
//       comments: FieldValue.arrayUnion(newComment),
//       commentCount: FieldValue.increment(1)
//     });

//     return NextResponse.json(newComment, { status: 201 });
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
//   }
// }






//-------------------------------------batch






import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";
import { FieldValue } from "firebase-admin/firestore";

// GET handler - optimized for batch read efficiency
export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // If you want to fetch multiple posts, pass an array of post IDs
    const postRef = db.collection("posts").doc(postId);
    const postDocs = await db.getAll(postRef); // Batch read operation

    if (postDocs.length === 0 || !postDocs[0].exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = postDocs[0].data()?.comments || [];
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

    // Fetch the username from the users collection once per user session
    const userDoc = await db.collection("users").doc(user.uid).get();
    const username = userDoc.exists ? userDoc.data()?.username : null;

    const postRef = db.collection("posts").doc(postId);

    // Prepare the new comment
    const newComment = {
      id: Date.now().toString(),
      authorId: user.uid,
      content,
      author: username || user.uid, // Use username fetched from users collection
      createdAt: getFormattedDate(),
      likes: 0,
      likedBy: []
    };

    // Start a write batch for more flexibility
    const batch = db.batch();
    batch.update(postRef, {
      comments: FieldValue.arrayUnion(newComment),
      commentCount: FieldValue.increment(1)
    });

    // Commit the batch write
    await batch.commit();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
