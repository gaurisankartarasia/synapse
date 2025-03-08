// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function POST(request: NextRequest) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const { reportedUserId, reason, report_type } = await request.json();
//     if (!reportedUserId || !reason || report_type !== "profile") {
//       return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
//     }

//     const reportRef = db.collection("reports").doc();
//     await reportRef.set({
//       reportedUserId,
//       reportedBy: payload.uid,
//       reason,
//       reportedAt: new Date().toISOString(),
//       report_type: "profile"
//     });

//     return NextResponse.json({ message: "Profile reported successfully" });
//   } catch (error) {
//     console.error("Error reporting profile:", error);
//     return NextResponse.json({ error: "Failed to report profile." }, { status: 500 });
//   }
// }


import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const cookie_store = await cookies();
    const token = cookie_store.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { reported_uid, reason, report_type } = await request.json();
    if (!reported_uid || !reason || report_type !== "profile") {
      return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
    }

    // Fetch usernames
    const reported_user_doc = await db.collection("users").doc(reported_uid).get();
    const reporting_user_doc = await db.collection("users").doc(payload.uid).get();

    if (!reported_user_doc.exists || !reporting_user_doc.exists) {
      return NextResponse.json({ error: "User(s) not found" }, { status: 404 });
    }

    const reported_username = reported_user_doc.data()?.username;
    const reporting_username = reporting_user_doc.data()?.username;

    if (!reported_username || !reporting_username) {
      return NextResponse.json({ error: "Username(s) not found" }, { status: 404 });
    }

    const report_ref = db.collection("reports").doc();
    await report_ref.set({
      reported_uid,
      reported_by: payload.uid,
      reason,
      reported_at: new Date().toISOString(),
      report_type: "profile",
      reported_username,
      reporting_username,
    });

    return NextResponse.json({ message: "Profile reported successfully" });
  } catch (error) {
    console.error("Error reporting profile:", error);
    return NextResponse.json({ error: "Failed to report profile." }, { status: 500 });
  }
}