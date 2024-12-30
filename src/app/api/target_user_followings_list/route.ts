// src/app/api/get-following/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  const targetUsername = new URL(request.url).searchParams.get("username");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const requestingUid = decodedToken.uid;

    // Fetch target user's UID by username (optional if API already gets UID directly)
    const targetUserSnapshot = await db
      .collection("users")
      .where("username", "==", targetUsername)
      .get();

    if (targetUserSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserUid = targetUserSnapshot.docs[0].id;

    // Check if the requesting user is allowed to view this data (if necessary)
    const privacyCheck = await db
      .collection("users")
      .doc(targetUserUid)
      .get();

    const isPrivate = privacyCheck.data()?.private;
    const isFollowing = (
      await db
        .collection("users")
        .doc(targetUserUid)
        .collection("followers")
        .doc(requestingUid)
        .get()
    ).exists;

    if (isPrivate && !isFollowing && requestingUid !== targetUserUid) {
      return NextResponse.json(
        { error: "This user's following list is private" },
        { status: 403 }
      );
    }

    // Fetch the following list
    const followingSnapshot = await db
      .collection("users")
      .doc(targetUserUid)
      .collection("following")
      .get();

    const following = await Promise.all(
      followingSnapshot.docs.map(async (doc) => {
        const followingData = await db.collection("users").doc(doc.id).get();
        return { uid: doc.id, ...followingData.data() };
      })
    );

    return NextResponse.json({ following });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}
