

// // app/api/post/comments/[commentId]/reply/[replyId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";
// import { FieldValue } from "firebase-admin/firestore";

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { commentId: string; replyId: string } }
// ) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify token and extract user ID
//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const { postId } = await request.json();
//     const { commentId, replyId } = params;

//     if (!postId || !commentId || !replyId) {
//       return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
//     }

//     // References to Firestore documents
//     const postRef = db.collection("posts").doc(postId);
//     const commentRef = postRef.collection("comments").doc(commentId);
//     const replyRef = commentRef.collection("replies").doc(replyId);

//     // Run transaction to delete reply and update counts
//     await db.runTransaction(async (transaction) => {
//       const replyDoc = await transaction.get(replyRef);

//       if (!replyDoc.exists) {
//         throw new Error("Reply not found");
//       }

//       const replyData = replyDoc.data();

//       // Ensure only the reply's author can delete it
//       if (replyData?.uid !== payload.uid) {
//         throw new Error("Unauthorized to delete this reply");
//       }

//       transaction.delete(replyRef);
//       transaction.update(commentRef, {
//         replyCount: FieldValue.increment(-1),
//       });
//       transaction.update(postRef, {
//         comment_count: FieldValue.increment(-1),
//       });
//     });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting reply:", error);

//     if (error instanceof Error) {
//       if (error.message === "Unauthorized to delete this reply") {
//         return NextResponse.json({ error: error.message }, { status: 403 });
//       }
//       if (error.message === "Reply not found") {
//         return NextResponse.json({ error: error.message }, { status: 404 });
//       }
//     }

//     return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 });
//   }
// }










import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { FieldValue } from "firebase-admin/firestore";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ commentId: string; replyId: string }> }
) {
  try {
    // Await the params promise
    const { commentId, replyId } = await context.params;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and extract user ID
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { postId } = await request.json();
    if (!postId || !commentId || !replyId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // References to Firestore documents
    const postRef = db.collection("posts").doc(postId);
    const commentRef = postRef.collection("comments").doc(commentId);
    const replyRef = commentRef.collection("replies").doc(replyId);

    // Run transaction to delete reply and update counts
    await db.runTransaction(async (transaction) => {
      const replyDoc = await transaction.get(replyRef);

      if (!replyDoc.exists) {
        throw new Error("Reply not found");
      }

      const replyData = replyDoc.data();

      // Ensure only the reply's author can delete it
      if (replyData?.uid !== payload.uid) {
        throw new Error("Unauthorized to delete this reply");
      }

      transaction.delete(replyRef);
      transaction.update(commentRef, {
        replyCount: FieldValue.increment(-1),
      });
      transaction.update(postRef, {
        comment_count: FieldValue.increment(-1),
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reply:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized to delete this reply") {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message === "Reply not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 });
  }
}
