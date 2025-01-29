

// app/api/comments/[commentId]/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";

type Props = {
  params: Promise<{ commentId: string }>;
};

// app/api/comments/[commentId]/report/route.ts
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const commentId = resolvedParams.commentId;
    const user = await verifyAuth(request);
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reason, postId } = await request.json();
    const reportRef = db.collection("reports").doc(`${commentId}_${user.uid}`);
    
    if ((await reportRef.get()).exists) {
      return NextResponse.json({ error: "Already reported" }, { status: 400 });
    }

    const postDoc = await db.collection("posts").doc(postId).get();
    const comment = postDoc.data()?.comments.find((c: any) => c.id === commentId);

    await reportRef.set({
      commentId,
      postId,
      reporterId: user.uid,
      reporterEmail: user.email,
      targetUserId: comment?.authorId || "unknown",
      reason,
      createdAt: getFormattedDate(),
      status: "pending",
      commentData: {
        author: comment?.author || "Unknown",
        content: comment?.content || "",
      }
    });


    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error reporting comment:", error);
    return NextResponse.json({ error: "Failed to report comment" }, { status: 500 });
  }
}