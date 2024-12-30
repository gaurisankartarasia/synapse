//app/api/check-block-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "../../../lib/firebaseAdmin";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    // Fetch the target user's UID by username
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUid = userSnapshot.docs[0].id;

    // Check block status
    const blockDoc = await db.collection("blocks").doc(decodedToken.uid).collection("blocked").doc(targetUid).get();

    const isBlocked = blockDoc.exists;

    return NextResponse.json({ isBlocked });
  } catch (error) {
    console.error("Error checking block status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
