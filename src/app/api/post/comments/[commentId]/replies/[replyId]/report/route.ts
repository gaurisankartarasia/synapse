// app/api/comments/[commentId]/replies/[replyId]/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";

type Props = {
  params: {
    commentId: string;
    replyId: string;
  };
};

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { commentId, replyId } = params;
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason, postId } = await request.json();
    const reportRef = db.collection("reports").doc(`${commentId}_${replyId}_${user.uid}`);
    
    if ((await reportRef.get()).exists) {
      return NextResponse.json({ error: "Already reported" }, { status: 400 });
    }

    const postDoc = await db.collection("posts").doc(postId).get();
    const comment = postDoc.data()?.comments.find((c: any) => c.id === commentId);
    const reply = comment?.replies?.find((r: any) => r.id === replyId);

    await reportRef.set({
      commentId,
      replyId,
      postId,
      reporterId: user.uid,
      reporterEmail: user.email,
      targetUserId: reply?.authorId || "unknown",
      reason,
      createdAt: getFormattedDate(),
      status: "pending",
      replyData: {
        author: reply?.author || "Unknown",
        content: reply?.content || "",
        parentComment: {
          id: commentId,
          author: comment?.author || "Unknown",
          content: comment?.content || ""
        }
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error reporting reply:", error);
    return NextResponse.json({ error: "Failed to report reply" }, { status: 500 });
  }
}