

// // app/api/post/comments/[commentId]/reply/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";
// import { getFormattedDate } from "@/utils/formatDate";
// import { FieldValue } from "firebase-admin/firestore";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { commentId: string } }
// ) {
//   try {
//     const { postId, content } = await request.json();
//     const { commentId } = params;

//     if (!postId || !content || !commentId) {
//       return NextResponse.json(
//         { error: "Post ID, comment ID, and content are required" },
//         { status: 400 }
//       );
//     }

//     const user = await verifyAuth(request);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const newReply = {
//       id: Date.now().toString(),
//       authorId: user.uid,
//       author: user.name || user.uid,
//       content,
//       createdAt: getFormattedDate(),
//       likes: 0,
//       likedBy: [],
//     };

//     // Reference to the post document
//     const postRef = db.collection("posts").doc(postId);
//     const postDoc = await postRef.get();

//     if (!postDoc.exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const postData = postDoc.data();
//     const comments = postData?.comments || [];

//     // Find the comment and add the reply
//     const updatedComments = comments.map((comment: any) => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           replies: [...(comment.replies || []), newReply],
//         };
//       }
//       return comment;
//     });

//     // Update the comments in the database
//     await postRef.update({
//       comments: updatedComments,
//     });

//     return NextResponse.json(newReply, { status: 201 });
//   } catch (error) {
//     console.error("Error adding reply:", error);
//     return NextResponse.json(
//       { error: "Failed to add reply" },
//       { status: 500 }
//     );
//   }
// }















// // app/api/post/comments/[commentId]/reply/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db, FieldValue } from "@/lib/firebaseAdmin";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { commentId: string } }
// ) {
//   try {
//     // Get token from cookies
//     const cookieStore =await cookies();
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

//     const { postId, content } = await request.json();
//     const { commentId } = params;

//     if (!postId || !content || !commentId) {
//       return NextResponse.json(
//         { error: "Post ID, comment ID, and content are required" },
//         { status: 400 }
//       );
//     }

//     // Fetch user data for the author name
//     const userDoc = await db.collection("users").doc(payload.uid).get();
//     const username = userDoc.exists ? userDoc.data()?.username : null;

//     const newReply = {
//       id: Date.now().toString(),
//       authorId: payload.uid,
//       author: username || payload.uid,
//       content,
//       createdAt: FieldValue.serverTimestamp(),
//       likes: 0,
//       likedBy: [],
//     };

//     // Reference to the post document
//     const postRef = db.collection("posts").doc(postId);
//     const postDoc = await postRef.get();

//     if (!postDoc.exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const postData = postDoc.data();
//     const comments = postData?.comments || [];

//     // Find the comment and add the reply
//     const updatedComments = comments.map((comment: any) => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           replies: [...(comment.replies || []), newReply],
//         };
//       }
//       return comment;
//     });

//     // Update the comments in the database
//     await postRef.update({
//       comments: updatedComments,
//     });

//     return NextResponse.json(newReply, { status: 201 });
//   } catch (error) {
//     console.error("Error adding reply:", error);
//     return NextResponse.json(
//       { error: "Failed to add reply" },
//       { status: 500 }
//     );
//   }
// }








// app/api/post/comments/[commentId]/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, Timestamp } from "@/lib/firebaseAdmin";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId || !commentId) {
      return NextResponse.json(
        { error: "Post ID and comment ID are required" },
        { status: 400 }
      );
    }

    const repliesRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .orderBy("createdAt", "asc");

    const repliesSnapshot = await repliesRef.get();
    const replies = repliesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { postId, content } = await request.json();
    const { commentId } = params;

    if (!postId || !content || !commentId) {
      return NextResponse.json(
        { error: "Post ID, comment ID, and content are required" },
        { status: 400 }
      );
    }

    // Fetch user data for the author name
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const username = userDoc.data()?.username;

    // Verify the comment exists
    const commentRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId);
    
    const commentDoc = await commentRef.get();
    if (!commentDoc.exists) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Start a batch write
    const batch = db.batch();

    // Create the reply document
    const replyRef = commentRef.collection("replies").doc();
    const newReply = {
      authorId: payload.uid,
      author: username || payload.uid,
      content,
      createdAt: Timestamp.now(),
      likeCount: 0,
      isEdited: false,
      lastEditedAt: null
    };

    // Add the reply to the subcollection
    batch.set(replyRef, newReply);

    // Update reply count in the parent comment
    batch.update(commentRef, {
      replyCount: (commentDoc.data()?.replyCount || 0) + 1
    });

    // Commit the batch write
    await batch.commit();

    return NextResponse.json({
      id: replyRef.id,
      ...newReply
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}

// Add DELETE endpoint for removing replies
export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { commentId } = params;
    const { postId, replyId } = await request.json();

    if (!postId || !commentId || !replyId) {
      return NextResponse.json(
        { error: "Post ID, comment ID, and reply ID are required" },
        { status: 400 }
      );
    }

    const commentRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId);
    
    const replyRef = commentRef.collection("replies").doc(replyId);
    
    // Verify the reply exists and belongs to the user
    const replyDoc = await replyRef.get();
    if (!replyDoc.exists) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    if (replyDoc.data()?.authorId !== payload.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Start a batch write
    const batch = db.batch();

    // Delete the reply
    batch.delete(replyRef);

    // Update reply count in the parent comment
    batch.update(commentRef, {
      replyCount: (await commentRef.get()).data()?.replyCount - 1
    });

    // Commit the batch write
    await batch.commit();

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}