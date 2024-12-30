
// // app/api/comments/[commentId]/like/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyAuth } from "@/utils/auth";

// type Props = {
//   params: Promise<{ commentId: string }>;
// };

// export async function POST(request: NextRequest, { params }: Props) {
//   try {
//     // Resolve the params promise to get the commentId
//     const resolvedParams = await params;
//     const commentId = resolvedParams.commentId;

//     const user = await verifyAuth(request);
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const commentRef = db.collection("comments").doc(commentId);
//     const commentDoc = await commentRef.get();

//     if (!commentDoc.exists) {
//       return NextResponse.json({ error: "Comment not found" }, { status: 404 });
//     }

//     const comment = commentDoc.data();
//     const likedBy = comment?.likedBy || [];
//     const userIndex = likedBy.indexOf(user.uid);

//     if (userIndex === -1) {
//       // Add like
//       await commentRef.update({
//         likes: (comment?.likes || 0) + 1,
//         likedBy: [...likedBy, user.uid],
//       });
//     } else {
//       // Remove like
//       likedBy.splice(userIndex, 1);
//       await commentRef.update({
//         likes: (comment?.likes || 0) - 1,
//         likedBy,
//       });
//     }

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error handling like:", error);
//     return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
//   }
// }








// app/api/comments/[commentId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";

type Props = {
  params: Promise<{ commentId: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const commentId = resolvedParams.commentId;
    const { postId } = await request.json();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postRef = db.collection("posts").doc(postId);
    
    await db.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) {
        throw new Error("Post not found");
      }

      const comments = postDoc.data()?.comments || [];
      const commentIndex = comments.findIndex((c: any) => c.id === commentId);
      
      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      const comment = comments[commentIndex];
      const likedBy = comment.likedBy || [];
      const userIndex = likedBy.indexOf(user.uid);

      if (userIndex === -1) {
        comments[commentIndex] = {
          ...comment,
          likes: (comment.likes || 0) + 1,
          likedBy: [...likedBy, user.uid]
        };
      } else {
        comments[commentIndex] = {
          ...comment,
          likes: (comment.likes || 0) - 1,
          likedBy: likedBy.filter((id: string) => id !== user.uid)
        };
      }

      transaction.update(postRef, { comments });
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
  }
}