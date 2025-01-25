

// // app/api/post/comments/[commentId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";
// import { FieldValue } from "firebase-admin/firestore";

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { commentId: string } }
// ) {
//   try {
//     const user = await verifyAuth(request);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const { postId } = body;

//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const postRef = db.collection("posts").doc(postId);
//     const postDoc = await postRef.get();

//     if (!postDoc.exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const comments = postDoc.data()?.comments || [];
//     const commentIndex = comments.findIndex(
//       (c: any) => c.id === params.commentId && c.authorId === user.uid
//     );

//     if (commentIndex === -1) {
//       return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
//     }

//     comments.splice(commentIndex, 1);
//     await postRef.update({
//       comments,
//       commentCount: FieldValue.increment(-1),
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
//   }
// }








// // app/api/post/comments/[commentId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';
// import { FieldValue } from "firebase-admin/firestore";

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { commentId: string } }
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

//     const body = await request.json();
//     const { postId } = body;

//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const postRef = db.collection("posts").doc(postId);
//     const postDoc = await postRef.get();

//     if (!postDoc.exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const comments = postDoc.data()?.comments || [];
//     const commentIndex = comments.findIndex(
//       (c: any) => c.id === params.commentId && c.authorId === payload.uid
//     );

//     if (commentIndex === -1) {
//       return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
//     }

//     comments.splice(commentIndex, 1);
//     await postRef.update({
//       comments,
//       commentCount: FieldValue.increment(-1),
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
//   }
// }







// app/api/post/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
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

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Get reference to the comment
    const commentRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(params.commentId);

    // Get the comment document
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author of the comment
    if (commentDoc.data()?.authorId !== payload.uid) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    // Start a batch write
    const batch = db.batch();

    // Delete all replies and their likes
    const repliesSnapshot = await commentRef.collection("replies").get();
    for (const replyDoc of repliesSnapshot.docs) {
      // Delete all likes for this reply
      const replyLikesSnapshot = await replyDoc.ref.collection("likes").get();
      replyLikesSnapshot.docs.forEach((likeDoc) => {
        batch.delete(likeDoc.ref);
      });
      
      // Delete the reply
      batch.delete(replyDoc.ref);
    }

    // Delete all likes for the comment
    const likesSnapshot = await commentRef.collection("likes").get();
    likesSnapshot.docs.forEach((likeDoc) => {
      batch.delete(likeDoc.ref);
    });

    // Delete the comment document
    batch.delete(commentRef);

    // Update post's comment count
    const postRef = db.collection("posts").doc(postId);
    batch.update(postRef, {
      commentCount: FieldValue.increment(-1)
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

// Add a helper function to recursively delete collections
// This is useful for Firestore, as it doesn't automatically delete subcollections
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

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}