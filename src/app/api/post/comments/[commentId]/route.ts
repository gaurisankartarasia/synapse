
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

//     const url = new URL(request.url);
//     const postId = url.searchParams.get("postId");
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
//       commentCount: FieldValue.increment(-1)
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
//   }
// }



// app/api/post/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = postDoc.data()?.comments || [];
    const commentIndex = comments.findIndex(
      (c: any) => c.id === params.commentId && c.authorId === user.uid
    );

    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    comments.splice(commentIndex, 1);
    await postRef.update({
      comments,
      commentCount: FieldValue.increment(-1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
