
// // src/app/api/v1/remove-follower/route.ts
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

//     // Delete the follow notification
//     const notificationsQuery = await db
//       .collection("users")
//       .doc(currentUid)
//       .collection("notifications")
//       .where("fromUid", "==", followerUid)
//       .where("type", "==", "new_follower")
//       .get();
      
//     const deletePromises = notificationsQuery.docs.map(doc => doc.ref.delete());
//     await Promise.all(deletePromises);

//     // Recalculate follower and following counts
//     const followersSnapshot = await db
//       .collection("users")
//       .doc(currentUid)
//       .collection("followers")
//       .get();
//     const followerCount = followersSnapshot.size;

//     const followingSnapshot = await db
//       .collection("users")
//       .doc(followerUid)
//       .collection("following")
//       .get();
//     const followingCount = followingSnapshot.size;

//     // Update counts for both users
//     await db.collection("users").doc(currentUid).update({ followerCount });
//     await db.collection("users").doc(followerUid).update({ followingCount });

//     return NextResponse.json({ 
//       success: true,
//       followerCount,
//       followingCount
//     });
//   } catch (error) {
//     console.error("Error removing follower:", error);
//     return NextResponse.json({ error: "Failed to remove follower" }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT and extract user ID
    const payload = await verifyJWT(token.value) as CustomJWTPayload;

    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const currentUid = payload.uid;
    const { followerUid } = await request.json();

    if (!followerUid) {
      return NextResponse.json({ error: "Follower UID is required" }, { status: 400 });
    }

    // Remove from followers collection
    await db.collection("users").doc(currentUid).collection("followers").doc(followerUid).delete();

    // Remove from following collection of the follower
    await db.collection("users").doc(followerUid).collection("following").doc(currentUid).delete();

    // Delete the follow notification
    const notificationsQuery = await db
      .collection("users")
      .doc(currentUid)
      .collection("notifications")
      .where("fromUid", "==", followerUid)
      .where("type", "==", "new_follower")
      .get();

    const deletePromises = notificationsQuery.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    // Recalculate follower and following counts
    const followerCount = (await db.collection("users").doc(currentUid).collection("followers").get()).size;
    const followingCount = (await db.collection("users").doc(followerUid).collection("following").get()).size;

    // Update counts for both users
    await db.collection("users").doc(currentUid).update({ followerCount });
    await db.collection("users").doc(followerUid).update({ followingCount });

    return NextResponse.json({ success: true, followerCount, followingCount });
  } catch (error) {
    console.error("Error removing follower:", error);
    return NextResponse.json({ error: "Failed to remove follower" }, { status: 500 });
  }
}
