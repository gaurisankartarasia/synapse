// // app/api/post/comments/[commentId]/reply/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";


// export async function POST(
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
//             replies: comment.replies.map((reply: any) => {
//               if (reply.id === replyId) {
//                 const isLiked = reply.likedBy?.includes(user.uid);
//                 return {
//                   ...reply,
//                   likes: isLiked ? reply.likes - 1 : reply.likes + 1,
//                   likedBy: isLiked
//                     ? reply.likedBy.filter((id: string) => id !== user.uid)
//                     : [...(reply.likedBy || []), user.uid]
//                 };
//               }
//               return reply;
//             })
//           };
//         }
//         return comment;
//       });
  
//       await postRef.update({ comments });
  
//       return NextResponse.json({ status: 'ok' }, { status: 200 });
//     } catch (error) {
//       console.error("Error liking reply:", error);
//       return NextResponse.json(
//         { error: "Failed to like reply" },
//         { status: 500 }
//       );
//     }
//   }







// app/api/post/comments/[commentId]/reply/[replyId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue, Timestamp } from "@/lib/firebaseAdmin";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

type Params = {
  params: {
    commentId: string;
    replyId: string;
  }
};

// Get like status for a reply
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Get and verify token
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

    const { commentId, replyId } = params;
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if the like document exists
    const likeRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .doc(replyId)
      .collection("likes")
      .doc(payload.uid);

    const likeDoc = await likeRef.get();

    return NextResponse.json({
      hasLiked: likeDoc.exists
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}

// Toggle like on a reply
export async function POST(request: NextRequest, { params }: Params) {
  try {
    // Get and verify token
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

    const { commentId, replyId } = params;
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Get references
    const replyRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .doc(replyId);

    const likeRef = replyRef
      .collection("likes")
      .doc(payload.uid);

    // Verify the reply exists
    const replyDoc = await replyRef.get();
    if (!replyDoc.exists) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    // Run transaction to handle like/unlike
    await db.runTransaction(async (transaction) => {
      const likeDoc = await transaction.get(likeRef);

      if (!likeDoc.exists) {
        // Add like
        transaction.set(likeRef, {
          userId: payload.uid,
          createdAt: Timestamp.now()
        });

        // Increment like count
        transaction.update(replyRef, {
          likeCount: FieldValue.increment(1)
        });
      } else {
        // Remove like
        transaction.delete(likeRef);

        // Decrement like count
        transaction.update(replyRef, {
          likeCount: FieldValue.increment(-1)
        });
      }
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("Error toggling reply like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

// Get all likes for a reply (optional, for moderation or analytics)
export async function GET_likes(request: NextRequest, { params }: Params) {
  try {
    const { commentId, replyId } = params;
    const postId = request.nextUrl.searchParams.get("postId");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const cursor = request.nextUrl.searchParams.get("cursor");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    let likesQuery = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .doc(replyId)
      .collection("likes")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .collection("replies")
        .doc(replyId)
        .collection("likes")
        .doc(cursor)
        .get();

      likesQuery = likesQuery.startAfter(cursorDoc);
    }

    const likesSnapshot = await likesQuery.get();
    const likes = likesSnapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));

    const lastVisible = likesSnapshot.docs[likesSnapshot.docs.length - 1];

    return NextResponse.json({
      likes,
      nextCursor: lastVisible?.id
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}