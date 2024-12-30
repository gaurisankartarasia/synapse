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

    // Add to followers and following
    const followerRef = db
      .collection("users")
      .doc(currentUid)
      .collection("followers")
      .doc(fromUid);

    const followingRef = db
      .collection("users")
      .doc(fromUid)
      .collection("following")
      .doc(currentUid);

    await followerRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    await followingRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Remove the follow request
    const followRequestRef = db
      .collection("users")
      .doc(currentUid)
      .collection("followRequests")
      .doc(fromUid);

    await followRequestRef.delete();

    // Update followers and following counts
    const followersSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("followers")
      .get();
    const followersCount = followersSnapshot.size;

    const followingSnapshot = await db
      .collection("users")
      .doc(fromUid)
      .collection("following")
      .get();
    const followingCount = followingSnapshot.size;

    await db.collection("users").doc(currentUid).update({ followersCount });
    await db.collection("users").doc(fromUid).update({ followingCount });

    return NextResponse.json({ status: "Follow request accepted" });
  } catch (error) {
    console.error("Error accepting follow request:", error);
    return NextResponse.json({ error: "Failed to accept follow request" }, { status: 500 });
  }
}
