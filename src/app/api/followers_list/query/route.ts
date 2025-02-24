// // src/app/api/get-followers/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function GET(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];
//   const targetUsername = new URL(request.url).searchParams.get("username"); // Get target username from query params

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const requestingUid = decodedToken.uid;

//     // Fetch the target user's UID based on username
//     const targetUserSnapshot = await db
//       .collection("users")
//       .where("username", "==", targetUsername)
//       .get();

//     if (targetUserSnapshot.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const targetUserUid = targetUserSnapshot.docs[0].id;

//     // Check if the target user's profile is private and the requesting user is not following
//     const targetUserData = await db.collection("users").doc(targetUserUid).get();
//     const isPrivate = targetUserData.data()?.private;

//     const isFollowing = (
//       await db
//         .collection("users")
//         .doc(targetUserUid)
//         .collection("followers")
//         .doc(requestingUid)
//         .get()
//     ).exists;

//     if (isPrivate && !isFollowing && requestingUid !== targetUserUid) {
//       return NextResponse.json(
//         { error: "This user's followers list is private" },
//         { status: 403 }
//       );
//     }

//     // Fetch the followers list
//     const followersSnapshot = await db
//       .collection("users")
//       .doc(targetUserUid)
//       .collection("followers")
//       .get();

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










// // src/app/api/get-followers/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { db } from "@/lib/firebaseAdmin";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: Request) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify JWT token
//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
//     const requestingUid = payload.uid;

//     if (!requestingUid) {
//       return NextResponse.json(
//         { error: "Invalid token payload" },
//         { status: 401 }
//       );
//     }

//     // Get target username from query params
//     const targetUsername = new URL(request.url).searchParams.get("username");

//     // Fetch the target user's UID based on username
//     const targetUserSnapshot = await db
//       .collection("users")
//       .where("username", "==", targetUsername)
//       .get();

//     if (targetUserSnapshot.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const targetUserUid = targetUserSnapshot.docs[0].id;

//     // Check if the target user's profile is private and the requesting user is not following
//     const targetUserData = await db.collection("users").doc(targetUserUid).get();
//     const isPrivate = targetUserData.data()?.private;

//     const isFollowing = (
//       await db
//         .collection("users")
//         .doc(targetUserUid)
//         .collection("followers")
//         .doc(requestingUid)
//         .get()
//     ).exists;

//     if (isPrivate && !isFollowing && requestingUid !== targetUserUid) {
//       return NextResponse.json(
//         { error: "This user's followers list is private" },
//         { status: 403 }
//       );
//     }

//     // Fetch the followers list
//     const followersSnapshot = await db
//       .collection("users")
//       .doc(targetUserUid)
//       .collection("followers")
//       .get();

//     const followers = await Promise.all(
//       followersSnapshot.docs.map(async (doc) => {
//         const followerData = await db.collection("users").doc(doc.id).get();
//         return { uid: doc.id, ...followerData.data() };
//       })
//     );

//     return NextResponse.json({ followers });
//   } catch (error) {
//     console.error("Error fetching followers:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch followers" },
//       { status: 500 }
//     );
//   }
// }






// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { db } from "@/lib/firebaseAdmin";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET() {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify JWT and extract user ID
//     const payload = await verifyJWT(token.value) as CustomJWTPayload;

//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const currentUid = payload.uid;

//     // Fetch the followers
//     const followersSnapshot = await db
//       .collection("users")
//       .doc(currentUid)
//       .collection("followers")
//       .get();

//     const followers = await Promise.all(
//       followersSnapshot.docs.map(async (doc) => {
//         const followerData = await db.collection("users").doc(doc.id).get();
//         const data = followerData.data();

//         if (data) {
//           // Check if the current user follows this follower
//           const followingStatus = await db
//             .collection("users")
//             .doc(currentUid)
//             .collection("following")
//             .doc(doc.id)
//             .get();

//           const followRequestStatus = data.private 
//             ? await db.collection("users").doc(doc.id).collection("followRequests").doc(currentUid).get()
//             : null;

//           return {
//             uid: doc.id,
//             profilePhotoURL: data.profilePhotoURL || null,
//             displayName: data.displayName || null,
//             username: data.username || null,
//             isVerified: data.isVerified || false,
//             isPrivate: data.isPrivate || false,
//             isFollowing: followingStatus.exists,
//             isRequested: followRequestStatus?.exists || false,
//           };
//         }
//         return null;
//       })
//     );

//     return NextResponse.json({ followers: followers.filter(Boolean) });
//   } catch (error) {
//     console.error("Error fetching followers:", error);
//     return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT and extract user ID
    const payload = await verifyJWT(token.value);
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    // Extract username from query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Fetch UID from username
    const userDoc = await db.collection("users").where("username", "==", username).get();
    if (userDoc.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileUid = userDoc.docs[0].id; // UID of the viewed profile

    // Fetch followers of the profile being viewed
    const followersSnapshot = await db.collection("users").doc(profileUid).collection("followers").get();

    const followers = await Promise.all(
      followersSnapshot.docs.map(async (doc) => {
        const followerData = await db.collection("users").doc(doc.id).get();
        const data = followerData.data();

        if (data) {
          return {
            uid: doc.id,
            username: data.username,
            displayName: data.displayName || data.username,
            profilePhotoURL: data.profilePhotoURL || null,
            isVerified: data.isVerified || false,
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
