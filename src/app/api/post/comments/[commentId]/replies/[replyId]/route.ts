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
  


// app/api/post/comments/[commentId]/replies/[replyId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
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

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Add authorization check to ensure the user owns the reply
    const comments = post.comments.map((comment: any) => {
      if (comment.id === commentId) {
        // Only allow deletion if the user is the author of the reply
        const reply = comment.replies.find((reply: any) => reply.id === replyId);
        if (!reply || reply.authorId !== payload.uid) {
          throw new Error("Unauthorized to delete this reply");
        }

        return {
          ...comment,
          replies: comment.replies.filter((reply: any) => reply.id !== replyId)
        };
      }
      return comment;
    });

    await postRef.update({ comments });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reply:", error);
    if (error instanceof Error && error.message === "Unauthorized to delete this reply") {
      return NextResponse.json(
        { error: "Unauthorized to delete this reply" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}


