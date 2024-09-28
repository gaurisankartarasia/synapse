import { NextResponse } from "next/server";
import { auth, db, admin } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const currentUid = decodedToken.uid;

    const { fromUid } = await request.json();

    if (!fromUid) {
      return NextResponse.json({ error: "Missing fromUid" }, { status: 400 });
    }

    // Remove the follow request
    const followRequestRef = db
      .collection("users")
      .doc(currentUid)
      .collection("followRequests")
      .doc(fromUid);

    await followRequestRef.delete();

    return NextResponse.json({ status: "Follow request rejected" });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    return NextResponse.json({ error: "Failed to reject follow request" }, { status: 500 });
  }
}
