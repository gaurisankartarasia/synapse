// // app/api/handle-follow-request/route.ts
// import { NextResponse } from "next/server";
// import { auth, db, admin } from "@/lib/firebaseAdmin";

// export async function POST(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];
//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const currentUid = decodedToken.uid;
//     var { fromUid, action } = await request.json();

//     if (!fromUid || !action) {
//       return NextResponse.json(
//         { error: "Missing required parameters" },
//         { status: 400 }
//       );
//     }

//     if (!["accept", "reject"].includes(action)) {
//       return NextResponse.json(
//         { error: "Invalid action" },
//         { status: 400 }
//       );
//     }

//     // Get reference to follow request
//     const followRequestRef = db
//       .collection("users")
//       .doc(currentUid)
//       .collection("followRequests")
//       .doc(fromUid);

//     if (action === "accept") {
//       // Add to followers and following collections
//       const followerRef = db
//         .collection("users")
//         .doc(currentUid)
//         .collection("followers")
//         .doc(fromUid);
//       const followingRef = db
//         .collection("users")
//         .doc(fromUid)
//         .collection("following")
//         .doc(currentUid);

//       await followerRef.set({
//         timestamp: admin.firestore.FieldValue.serverTimestamp(),
//       });
//       await followingRef.set({
//         timestamp: admin.firestore.FieldValue.serverTimestamp(),
//       });

//       // Update counts
//       const followersSnapshot = await db
//         .collection("users")
//         .doc(currentUid)
//         .collection("followers")
//         .get();
//       const followerCount = followersSnapshot.size;

//       const followingSnapshot = await db
//         .collection("users")
//         .doc(fromUid)
//         .collection("following")
//         .get();
//       const followingCount = followingSnapshot.size;

//       await db.collection("users").doc(currentUid).update({ followerCount });
//       await db.collection("users").doc(fromUid).update({ followingCount });
//     }

//     // Delete the follow request in both cases
//     await followRequestRef.delete();

//     return NextResponse.json({
//       status: `Follow request ${action}ed successfully`
//     });
//   } catch (error) {
//     console.error(`Error ${action}ing follow request:`, error);
//     return NextResponse.json(
//       { error: `Failed to ${action} follow request` },
//       { status: 500 }
//     );
//   }
// }






import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(request: Request) {
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

    const currentUid = payload.uid;
    const { fromUid, action } = await request.json();

    if (!fromUid || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Reference to follow request
    const followRequestRef = db
      .collection("users")
      .doc(currentUid)
      .collection("followRequests")
      .doc(fromUid);

    if (action === "accept") {
      // Add to followers and following collections
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

      // Update counts
      const followersSnapshot = await db
        .collection("users")
        .doc(currentUid)
        .collection("followers")
        .get();
      const followerCount = followersSnapshot.size;

      const followingSnapshot = await db
        .collection("users")
        .doc(fromUid)
        .collection("following")
        .get();
      const followingCount = followingSnapshot.size;

      await db.collection("users").doc(currentUid).update({ followerCount });
      await db.collection("users").doc(fromUid).update({ followingCount });
    }

    // Delete the follow request in both cases
    await followRequestRef.delete();

    return NextResponse.json({
      status: `Follow request ${action}ed successfully`,
    });
  } catch (error) {
    console.error(`Error`, error);
    return NextResponse.json(
      { error: `Failed` },
      { status: 500 }
    );
  }
}
