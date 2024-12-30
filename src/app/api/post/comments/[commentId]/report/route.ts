// app/api/comments/[commentId]/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/utils/auth";
import { getFormattedDate } from "@/utils/formatDate";

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await verifyAuth(request);
    const { reason, postId } = await request.json();
    const commentId = params.commentId;

    // Check if user has already reported this comment
    const existingReport = await db
      .collection("reports")
      .where("commentId", "==", commentId)
      .where("reporterId", "==", user.uid)
      .get();

    if (!existingReport.empty) {
      return NextResponse.json(
        { error: "You have already reported this comment" },
        { status: 400 }
      );
    }

    const report = {
      commentId,
      postId,
      reporterId: user.uid,
      reporterEmail: user.email,
      reason,
      createdAt: getFormattedDate(),
      status: "pending" // Can be 'pending', 'reviewed', 'resolved'
    };

    await db.collection("reports").add(report);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error reporting comment:", error);
    return NextResponse.json({ error: "Failed to report comment" }, { status: 500 });
  }
}