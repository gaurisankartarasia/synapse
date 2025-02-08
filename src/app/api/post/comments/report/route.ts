import { NextResponse } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";  

export async function POST(req: Request) {
  try {
    const { postId, commentId, replyId, reason } = await req.json();

    if (!postId || !commentId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reportData = {
      postId,
      commentId,
      replyId: replyId || null,
      reason,
      created_at: FieldValue.serverTimestamp(),
      report_type: "comment"
    };

    // Save to Firestore under "reports" collection
    const reportRef = await db.collection("reports").add(reportData);

    return NextResponse.json({ message: "Report submitted successfully", id: reportRef.id }, { status: 201 });
  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
