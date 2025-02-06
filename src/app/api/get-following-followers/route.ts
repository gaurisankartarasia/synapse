
// //app/api/get-following-followers/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function GET(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];
//   const { searchParams } = new URL(request.url);
//   const username = searchParams.get("username");

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     const currentUid = decodedToken.uid;

//     // Fetch the user document based on username instead of uid
//     const userQuery = await db
//       .collection("users")
//       .where("username", "==", username)
//       .limit(1)
//       .get();

//     if (userQuery.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const targetUserDoc = userQuery.docs[0];
//     const targetUid = targetUserDoc.id;
//     const userData = targetUserDoc.data() || {};
//     const followersCount = userData.followersCount ?? 0;
//     const followingCount = userData.followingCount ?? 0;

//     console.log(`Retrieved counts - Followers: ${followersCount}, Following: ${followingCount}`);

//     const isFollowing = await db
//       .collection("users")
//       .doc(currentUid)
//       .collection("following")
//       .doc(targetUid)
//       .get()
//       .then((doc) => doc.exists);

//     const isRequested = await db
//       .collection("users")
//       .doc(targetUid)
//       .collection("followRequests")
//       .doc(currentUid)
//       .get()
//       .then((doc) => doc.exists);

//     return NextResponse.json({
//       followersCount,
//       followingCount,
//       isFollowing,
//       isRequested,
//     });
//   } catch (error) {
//     console.error("Error fetching followers/following count:", error);
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }






// app/api/get-following-followers/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const currentUid = decodedToken.uid;

    // Fetch the user document based on username
    const userQuery = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUserDoc = userQuery.docs[0];
    const targetUid = targetUserDoc.id;
    const userData = targetUserDoc.data() || {};
    const followersCount = userData.followersCount ?? 0;
    const followingCount = userData.followingCount ?? 0;

    // Check if current user is following target user
    const isFollowing = await db
      .collection("users")
      .doc(currentUid)
      .collection("following")
      .doc(targetUid)
      .get()
      .then((doc) => doc.exists);

    // Check if current user has requested to follow target user
    const isRequested = await db
      .collection("users")
      .doc(targetUid)
      .collection("followRequests")
      .doc(currentUid)
      .get()
      .then((doc) => doc.exists);

    // Check if either user has blocked the other
    const currentUserBlocked = await db
      .collection("blocks")
      .doc(currentUid)
      .collection("blocked")
      .doc(targetUid)
      .get();

    const targetUserBlocked = await db
      .collection("blocks")
      .doc(targetUid)
      .collection("blocked")
      .doc(currentUid)
      .get();

    if (currentUserBlocked.exists || targetUserBlocked.exists) {
      return NextResponse.json(
        { error: "Content not available" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      followersCount,
      followingCount,
      isFollowing,
      isRequested,
    });

  } catch (error) {
    console.error("Error fetching followers/following count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}