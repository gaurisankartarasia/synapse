// //app/api/post/comments/[commentId]/replies/[replyId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";

// // app/api/post/comments/[commentId]/replies/[replyId]/route.ts
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { commentId: string; replyId: string } }
//   ) {
//     try {
//       const { postId } = await request.json();
//       const { commentId, replyId } = params;
  
//       const user = await verifyAuth(request);
//       if (!user) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }
  
//       const postRef = db.collection("posts").doc(postId);
//       const postDoc = await postRef.get();
//       const post = postDoc.data();
  
//       if (!post) {
//         return NextResponse.json({ error: "Post not found" }, { status: 404 });
//       }
  
//       const comments = post.comments.map((comment: any) => {
//         if (comment.id === commentId) {
//           return {
//             ...comment,
//             replies: comment.replies.filter((reply: any) => reply.id !== replyId)
//           };
//         }
//         return comment;
//       });
  
//       await postRef.update({ comments });
  
//       return NextResponse.json({ success: true }, { status: 200 });
//     } catch (error) {
//       console.error("Error deleting reply:", error);
//       return NextResponse.json(
//         { error: "Failed to delete reply" },
//         { status: 500 }
//       );
//     }
//   }
  


// // app/api/post/comments/[commentId]/replies/[replyId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { commentId: string; replyId: string } }
// ) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Verify token and type assert the payload
//     const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
//     if (!payload.uid) {
//       return NextResponse.json(
//         { error: 'Invalid token payload' },
//         { status: 401 }
//       );
//     }

//     const { postId } = await request.json();
//     const { commentId, replyId } = params;

//     const postRef = db.collection("posts").doc(postId);
//     const postDoc = await postRef.get();
//     const post = postDoc.data();

//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     // Add authorization check to ensure the user owns the reply
//     const comments = post.comments.map((comment: any) => {
//       if (comment.id === commentId) {
//         // Only allow deletion if the user is the author of the reply
//         const reply = comment.replies.find((reply: any) => reply.id === replyId);
//         if (!reply || reply.authorId !== payload.uid) {
//           throw new Error("Unauthorized to delete this reply");
//         }

//         return {
//           ...comment,
//           replies: comment.replies.filter((reply: any) => reply.id !== replyId)
//         };
//       }
//       return comment;
//     });

//     await postRef.update({ comments });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting reply:", error);
//     if (error instanceof Error && error.message === "Unauthorized to delete this reply") {
//       return NextResponse.json(
//         { error: "Unauthorized to delete this reply" },
//         { status: 403 }
//       );
//     }
//     return NextResponse.json(
//       { error: "Failed to delete reply" },
//       { status: 500 }
//     );
//   }
// }




// app/api/post/comments/[commentId]/reply/[replyId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string; replyId: string } }
) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { postId } = await request.json();
    const { commentId, replyId } = params;

    if (!postId || !commentId || !replyId) {
      return NextResponse.json(
        { error: "Post ID, comment ID, and reply ID are required" },
        { status: 400 }
      );
    }

    // Get reference to the reply
    const replyRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .doc(replyId);

    // Get the reply document
    const replyDoc = await replyRef.get();

    if (!replyDoc.exists) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author of the reply
    if (replyDoc.data()?.authorId !== payload.uid) {
      return NextResponse.json(
        { error: "Unauthorized to delete this reply" },
        { status: 403 }
      );
    }

    // Start a batch write
    const batch = db.batch();

    // Get the comment reference
    const commentRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId);

    // Delete all likes for this reply
    const likesSnapshot = await replyRef.collection("likes").get();
    likesSnapshot.docs.forEach((likeDoc) => {
      batch.delete(likeDoc.ref);
    });

    // Delete the reply
    batch.delete(replyRef);

    // Update the reply count in the comment
    batch.update(commentRef, {
      replyCount: FieldValue.increment(-1)
    });

    // Commit the batch
    await batch.commit();

    // Log the deletion for auditing purposes
    console.log(`Reply ${replyId} deleted by user ${payload.uid} at ${new Date().toISOString()}`);

    return NextResponse.json(
      { 
        success: true,
        message: "Reply deleted successfully",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting reply:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to delete a collection
async function deleteCollection(collectionRef: any) {
  const batchSize = 500;
  const query = collectionRef.limit(batchSize);
  
  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query: any, resolve: Function) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}