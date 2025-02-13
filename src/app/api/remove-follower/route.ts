// // src/app/api/remove-follower/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function POST(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const currentUid = decodedToken.uid;
//     const { followerUid } = await request.json();

//     if (!followerUid) {
//       return NextResponse.json({ error: "Follower UID is required" }, { status: 400 });
//     }

//     // Remove from followers collection
//     await db
//       .collection("users")
//       .doc(currentUid)
//       .collection("followers")
//       .doc(followerUid)
//       .delete();

//     // Remove from following collection of the follower
//     await db
//       .collection("users")
//       .doc(followerUid)
//       .collection("following")
//       .doc(currentUid)
//       .delete();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error removing follower:", error);
//     return NextResponse.json({ error: "Failed to remove follower" }, { status: 500 });
//   }
// }









// src/app/api/remove-follower/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const currentUid = decodedToken.uid;
    const { followerUid } = await request.json();

    if (!followerUid) {
      return NextResponse.json({ error: "Follower UID is required" }, { status: 400 });
    }

    // Remove from followers collection
    await db
      .collection("users")
      .doc(currentUid)
      .collection("followers")
      .doc(followerUid)
      .delete();

    // Remove from following collection of the follower
    await db
      .collection("users")
      .doc(followerUid)
      .collection("following")
      .doc(currentUid)
      .delete();

    // Delete the follow notification
    const notificationsQuery = await db
      .collection("users")
      .doc(currentUid)
      .collection("notifications")
      .where("fromUid", "==", followerUid)
      .where("type", "==", "new_follower")
      .get();
      
    const deletePromises = notificationsQuery.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    // Recalculate follower and following counts
    const followersSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("followers")
      .get();
    const followerCount = followersSnapshot.size;

    const followingSnapshot = await db
      .collection("users")
      .doc(followerUid)
      .collection("following")
      .get();
    const followingCount = followingSnapshot.size;

    // Update counts for both users
    await db.collection("users").doc(currentUid).update({ followerCount });
    await db.collection("users").doc(followerUid).update({ followingCount });

    return NextResponse.json({ 
      success: true,
      followerCount,
      followingCount
    });
  } catch (error) {
    console.error("Error removing follower:", error);
    return NextResponse.json({ error: "Failed to remove follower" }, { status: 500 });
  }
}