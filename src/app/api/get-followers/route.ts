
// src/app/api/get-followers/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const currentUid = decodedToken.uid;

    const followersSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("followers")
      .get();

    const followers = await Promise.all(
      followersSnapshot.docs.map(async (doc) => {
        const followerData = await db.collection("users").doc(doc.id).get();
        const data = followerData.data();

        if (data) {
          // Check if current user is following this follower
          const followingStatus = await db
            .collection("users")
            .doc(currentUid)
            .collection("following")
            .doc(doc.id)
            .get();

          // Check for follow request if user is private
          const followRequestStatus = data.private ? await db
            .collection("users")
            .doc(doc.id)
            .collection("followRequests")
            .doc(currentUid)
            .get() : null;

          return {
            uid: doc.id,
            profilePhotoURL: data.profilePhotoURL || null,
            displayName: data.displayName || null,
            username: data.username || null,
            isVerified: data.isVerified || false,
            isPrivate: data.isPrivate || false,
            isFollowing: followingStatus.exists,
            isRequested: followRequestStatus?.exists || false
          };
        }

        return null;
      })
    );

    return NextResponse.json({ followers: followers.filter(Boolean) });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}
