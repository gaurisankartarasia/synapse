
import { NextResponse } from "next/server";
import { auth, db, admin } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { targetUsername } = await request.json();
    const decodedToken = await auth.verifyIdToken(token);
    const currentUid = decodedToken.uid;

    // Fetch target user data
    const userQuery = await db
      .collection("users")
      .where("username", "==", targetUsername)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserDoc = userQuery.docs[0];
    const targetUid = targetUserDoc.id;
    const targetUserData = targetUserDoc.data();

    if (currentUid === targetUid) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    const followingRef = db
      .collection("users")
      .doc(currentUid)
      .collection("following")
      .doc(targetUid);

    const followerRef = db
      .collection("users")
      .doc(targetUid)
      .collection("followers")
      .doc(currentUid);

    const followRequestRef = db
      .collection("users")
      .doc(targetUid)
      .collection("followRequests")
      .doc(currentUid);

    const followRequestDoc = await followRequestRef.get();
    const isFollowing = (await followingRef.get()).exists;

    if (targetUserData?.private) {
      if (isFollowing) {
        // Unfollow a private user and handle follow requests
        await followingRef.delete();
        await followerRef.delete();
        if (followRequestDoc.exists) {
          await followRequestRef.delete();
        }
        return NextResponse.json({ status: "Unfollowed" });
      } else {
        if (!followRequestDoc.exists) {
          await followRequestRef.set({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
          return NextResponse.json({ status: "Follow request sent" });
        } else {
          // If follow request already exists, cancel it
          await followRequestRef.delete();
          return NextResponse.json({ status: "Follow request canceled" });
        }
      }
    } else {
      if (isFollowing) {
        // Unfollow a public user
        await followingRef.delete();
        await followerRef.delete();
      } else {
        // Follow a public user
        await followingRef.set({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        await followerRef.set({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Recalculate follower and following counts
      const followersSnapshot = await db
        .collection("users")
        .doc(targetUid)
        .collection("followers")
        .get();
      const followerCount = followersSnapshot.size;

      const followingSnapshot = await db
        .collection("users")
        .doc(currentUid)
        .collection("following")
        .get();
      const followingCount = followingSnapshot.size;

      await targetUserDoc.ref.update({ followersCount: followerCount });
      await db.collection("users").doc(currentUid).update({ followingCount: followingCount });

      return NextResponse.json({
        following: !isFollowing,
        followersCount: followerCount,
        followingCount: followingCount,
      });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    return NextResponse.json({ error: "Failed to follow/unfollow user" }, { status: 500 });
  }
}
