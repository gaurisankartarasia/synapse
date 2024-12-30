// import { NextRequest, NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function POST(request:NextRequest) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];
//   const { targetUsername } = await request.json();

//   if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const currentUserUid = decodedToken.uid;

//     const targetUserSnapshot = await db.collection("users").where("username", "==", targetUsername).get();

//     if (targetUserSnapshot.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const targetUserDoc = targetUserSnapshot.docs[0];
//     const targetUserUid = targetUserDoc.id;

//     await db.collection("blocked").doc(currentUserUid).set(
//       {
//         blockedUsers: { [targetUserUid]: true },
//       },
//       { merge: true }
//     );

//     return NextResponse.json({ status: "Blocked" });
//   } catch (error) {
//     console.error("Error blocking user:", error);
//     return NextResponse.json({ error: "Failed to block user" }, { status: 500 });
//   }
// }









import { NextRequest, NextResponse } from "next/server";
import { admin, db, auth } from "../../../lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const targetUsername = body.targetUsername;

    // Fetch target user's UID
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", targetUsername)
      .get();

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUid = userSnapshot.docs[0].id;

    // Block the user
    await db.collection("blocks").doc(decodedToken.uid).collection("blocked").doc(targetUid).set({
      blockedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
