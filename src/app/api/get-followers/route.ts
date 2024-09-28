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
    const uid = decodedToken.uid;

    const followersSnapshot = await db
      .collection("users")
      .doc(uid)
      .collection("followers")
      .get();

    const followers = await Promise.all(
      followersSnapshot.docs.map(async (doc) => {
        const followerData = await db.collection("users").doc(doc.id).get();
        return { uid: doc.id, ...followerData.data() };
      })
    );

    return NextResponse.json({ followers });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}











// // src/app/api/get-followers/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function GET(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];
//   const { searchParams } = new URL(request.url);
//   const targetUsername = searchParams.get("username");

//   if (!token || !targetUsername) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     const targetUserSnapshot = await db.collection("users").where("username", "==", targetUsername).get();
//     if (targetUserSnapshot.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }
//     const targetUser = targetUserSnapshot.docs[0].data();

//     if (targetUser.private) {
//       // Check if the current user follows the target user
//       const followSnapshot = await db.collection("users")
//         .doc(targetUserSnapshot.docs[0].id)
//         .collection("followers")
//         .doc(uid)
//         .get();

//       if (!followSnapshot.exists) {
//         return NextResponse.json({ error: "This user's followers are private" }, { status: 403 });
//       }
//     }

//     const followersSnapshot = await db.collection("users").doc(targetUserSnapshot.docs[0].id).collection("followers").get();

//     const followers = await Promise.all(
//       followersSnapshot.docs.map(async (doc) => {
//         const followerData = await db.collection("users").doc(doc.id).get();
//         return { uid: doc.id, ...followerData.data() };
//       })
//     );

//     return NextResponse.json({ followers });
//   } catch (error) {
//     console.error("Error fetching followers:", error);
//     return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
//   }
// }
