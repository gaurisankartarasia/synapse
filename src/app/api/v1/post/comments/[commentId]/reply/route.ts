// // app/api/v1/post/comments/[commentId]/reply/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";
// import { FieldValue } from "firebase-admin/firestore";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { commentId: string } }
// ) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify token and type assert the payload
//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const { postId, content } = await request.json();
//     const { commentId } = params;

//     if (!postId || !content || !commentId) {
//       return NextResponse.json(
//         { error: "Post ID, comment ID, and content are required" },
//         { status: 400 }
//       );
//     }


//     // Reference to the post, comment, and replies collection
//     const postRef = db.collection("posts").doc(postId);
//     const commentRef = postRef.collection("comments").doc(commentId);
//     const repliesRef = commentRef.collection("replies");
    
//     // Create a new reply document
//     const newReplyRef = repliesRef.doc(); // Auto-generate ID
//     const newReply = {
//       id: newReplyRef.id, // Use Firestore-generated ID
//       uid: payload.uid,
//       content,
//       createdAt: FieldValue.serverTimestamp(),
//       likes: 0,
//     };

//     // Run transaction to add reply and update both reply count in the comment and comment count in the post
//     await db.runTransaction(async (transaction) => {
//       const commentDoc = await transaction.get(commentRef);
//       if (!commentDoc.exists) {
//         throw new Error("Comment not found");
//       }

//       // Add the reply
//       transaction.set(newReplyRef, newReply);
      
//       // Increment the reply count on the comment
//       transaction.update(commentRef, {
//         replyCount: FieldValue.increment(1),
//       });

//       // Also increment the comment count on the post
//       transaction.update(postRef, {
//         commentCount: FieldValue.increment(1),
//       });
//     });

//     return NextResponse.json(newReply, { status: 201 });
//   } catch (error) {
//     console.error("Error adding reply:", error);
//     return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
//   }
// }








import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    // Await the params promise
    const { commentId } = await context.params;

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

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const commentRef = db.collection("posts").doc(postId).collection("comments").doc(commentId);
    const likeRef = commentRef.collection("likes").doc(payload.uid);

    await db.runTransaction(async (transaction) => {
      const likeDoc = await transaction.get(likeRef);
      const commentDoc = await transaction.get(commentRef);

      if (!commentDoc.exists) {
        throw new Error("Comment not found");
      }

      if (likeDoc.exists) {
        // If already liked, unlike it
        transaction.delete(likeRef);
        transaction.update(commentRef, {
          likes: FieldValue.increment(-1),
        });
      } else {
        // If not liked, add like
        transaction.set(likeRef, { uid: payload.uid, createdAt: FieldValue.serverTimestamp() });
        transaction.update(commentRef, {
          likes: FieldValue.increment(1),
        });
      }
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
  }
}
