import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { reportedUserId, reason, report_type } = await request.json();
    if (!reportedUserId || !reason || report_type !== "profile") {
      return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
    }

    const reportRef = db.collection("reports").doc();
    await reportRef.set({
      reportedUserId,
      reportedBy: payload.uid,
      reason,
      reportedAt: new Date().toISOString(),
      report_type: "profile"
    });

    return NextResponse.json({ message: "Profile reported successfully" });
  } catch (error) {
    console.error("Error reporting profile:", error);
    return NextResponse.json({ error: "Failed to report profile." }, { status: 500 });
  }
}
