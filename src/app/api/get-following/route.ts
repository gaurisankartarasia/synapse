
// // src/app/api/get-following/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function GET(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     const followingSnapshot = await db
//       .collection("users")
//       .doc(uid)
//       .collection("following")
//       .get();

//     const following = await Promise.all(
//       followingSnapshot.docs.map(async (doc) => {
//         const followingData = await db.collection("users").doc(doc.id).get();
//         const data = followingData.data();

//         if (data) {
//           return {
//             uid: doc.id,
//             profilePhotoURL: data.profilePhotoURL || null,
//             displayName: data.displayName || null,
//             username: data.username || null,
//             verified: data.verified || false,
//             private: data.private || false,
//           };
//         }

//         return null;
//       })
//     );

//     return NextResponse.json({ following: following.filter(Boolean) });
//   } catch (error) {
//     console.error("Error fetching following:", error);
//     return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
//   }
// }







// src/app/api/get-following/route.ts
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

    const followingSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("following")
      .get();

    const following = await Promise.all(
      followingSnapshot.docs.map(async (doc) => {
        const followingData = await db.collection("users").doc(doc.id).get();
        const data = followingData.data();

        if (data) {
          // For following users, we already know isFollowing is true
          // But we might need to check for follow requests if they became private
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
            isFollowing: true, // Since this is from following collection
            isRequested: followRequestStatus?.exists || false
          };
        }

        return null;
      })
    );

    return NextResponse.json({ following: following.filter(Boolean) });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}