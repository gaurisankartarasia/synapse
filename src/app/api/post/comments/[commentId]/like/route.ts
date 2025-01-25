
// // app/api/comments/[commentId]/like/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";

// type Props = {
//   params: Promise<{ commentId: string }>;
// };

// export async function POST(request: NextRequest, { params }: Props) {
//   try {
//     const resolvedParams = await params;
//     const commentId = resolvedParams.commentId;
//     const { postId } = await request.json();

//     const user = await verifyAuth(request);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const postRef = db.collection("posts").doc(postId);
    
//     await db.runTransaction(async (transaction) => {
//       const postDoc = await transaction.get(postRef);
//       if (!postDoc.exists) {
//         throw new Error("Post not found");
//       }

//       const comments = postDoc.data()?.comments || [];
//       const commentIndex = comments.findIndex((c: any) => c.id === commentId);
      
//       if (commentIndex === -1) {
//         throw new Error("Comment not found");
//       }

//       const comment = comments[commentIndex];
//       const likedBy = comment.likedBy || [];
//       const userIndex = likedBy.indexOf(user.uid);

//       if (userIndex === -1) {
//         comments[commentIndex] = {
//           ...comment,
//           likes: (comment.likes || 0) + 1,
//           likedBy: [...likedBy, user.uid]
//         };
//       } else {
//         comments[commentIndex] = {
//           ...comment,
//           likes: (comment.likes || 0) - 1,
//           likedBy: likedBy.filter((id: string) => id !== user.uid)
//         };
//       }

//       transaction.update(postRef, { comments });
//     });

//     return NextResponse.json({ status: 'ok' });
//   } catch (error) {
//     console.error("Error handling like:", error);
//     return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
//   }
// }










// // app/api/comments/[commentId]/like/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';

// type Props = {
//   params: Promise<{ commentId: string }>;
// };

// export async function POST(request: NextRequest, { params }: Props) {
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

//     const resolvedParams = await params;
//     const commentId = resolvedParams.commentId;
//     const { postId } = await request.json();

//     const postRef = db.collection("posts").doc(postId);
    
//     await db.runTransaction(async (transaction) => {
//       const postDoc = await transaction.get(postRef);
//       if (!postDoc.exists) {
//         throw new Error("Post not found");
//       }

//       const comments = postDoc.data()?.comments || [];
//       const commentIndex = comments.findIndex((c: any) => c.id === commentId);
      
//       if (commentIndex === -1) {
//         throw new Error("Comment not found");
//       }

//       const comment = comments[commentIndex];
//       const likedBy = comment.likedBy || [];
//       const userIndex = likedBy.indexOf(payload.uid);

//       if (userIndex === -1) {
//         comments[commentIndex] = {
//           ...comment,
//           likes: (comment.likes || 0) + 1,
//           likedBy: [...likedBy, payload.uid]
//         };
//       } else {
//         comments[commentIndex] = {
//           ...comment,
//           likes: (comment.likes || 0) - 1,
//           likedBy: likedBy.filter((id: string) => id !== payload.uid)
//         };
//       }

//       transaction.update(postRef, { comments });
//     });

//     return NextResponse.json({ status: 'ok' });
//   } catch (error) {
//     console.error("Error handling like:", error);
//     return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
//   }
// }





// app/api/comments/[commentId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue, Timestamp } from "@/lib/firebaseAdmin";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

type Props = {
  params: Promise<{ commentId: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
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

    const resolvedParams = await params;
    const commentId = resolvedParams.commentId;
    const { postId } = await request.json();

    const postRef = db.collection("posts").doc(postId);
    const commentRef = postRef.collection("comments").doc(commentId);
    const likeRef = commentRef.collection("likes").doc(payload.uid);

    // Get the comment document to verify it exists
    const commentDoc = await commentRef.get();
    if (!commentDoc.exists) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    await db.runTransaction(async (transaction) => {
      const likeDoc = await transaction.get(likeRef);

      if (!likeDoc.exists) {
        // Add like
        transaction.set(likeRef, {
          userId: payload.uid,
          createdAt: Timestamp.now()
        });

        // Increment the likes counter in the comment document
        transaction.update(commentRef, {
          likeCount: FieldValue.increment(1)
        });
      } else {
        // Remove like
        transaction.delete(likeRef);

        // Decrement the likes counter in the comment document
        transaction.update(commentRef, {
          likeCount: FieldValue.increment(-1)
        });
      }
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
  }
}

// Add a GET endpoint to check if a user has liked a comment
export async function GET(request: NextRequest, { params }: Props) {
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

    const resolvedParams = await params;
    const commentId = resolvedParams.commentId;
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const likeRef = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("likes")
      .doc(payload.uid);

    const likeDoc = await likeRef.get();

    return NextResponse.json({
      hasLiked: likeDoc.exists
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
}