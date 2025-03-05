

// //src/app/api/user-profile/query/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const username = searchParams.get("username");

//   try {
//     // Get and verify token
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");
//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decodedToken = (await verifyJWT(token.value)) as CustomJWTPayload;
//     if (!decodedToken.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }
//     const currentUid = decodedToken.uid;

//     // Get target user data
//     const userQuery = await db.collection("users").where("username", "==", username).limit(1).get();

//     if (userQuery.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const targetUserDoc = userQuery.docs[0];
//     const targetUid = targetUserDoc.id;
//     const userData = targetUserDoc.data();

//     // Get following status in parallel
//     const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
//       db.collection("users").doc(currentUid).collection("following").doc(targetUid).get(),
//       db.collection("users").doc(targetUid).collection("followRequests").doc(currentUid).get(),
//       db.collection("users").doc(targetUid).collection("following").doc(currentUid).get(),
//     ]);

//     // Determine if the target user follows the current user but is not followed back
//     const isFollowingWithoutFollowback = followedByStatus.exists && !followingStatus.exists;

//     // Return only the specified fields
//     return NextResponse.json({
//       username: userData.username,
//       displayName: userData.displayName,
//       isVerified: userData.isVerified ?? false,
//       isPrivate: userData.isPrivate ?? false,
//       createdAt: userData.createdAt,
//       bio: userData.bio,
//       profilePhotoURL: userData.profilePhotoURL,
//       uid: targetUid,
//       followerCount: userData.followerCount ?? 0,
//       followingCount: userData.followingCount ?? 0,
//       isFollowing: followingStatus.exists,
//       isRequested: requestStatus.exists,
//       isFollowingWithoutFollowback,
//     });
//   } catch (error) {
//     console.error("Error in profile API:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }





// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const username = searchParams.get("username");

//   if (!username) {
//     return NextResponse.json({ error: "Username is required" }, { status: 400 });
//   }

//   try {
//     // Get and verify token
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");
//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
//     if (!decodedToken.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }
//     const currentUid = decodedToken.uid;

//     // Optimized query using composite index
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
//     const userData = targetUserDoc.data();

//     // Parallel queries with optimized references
//     const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
//       db.collection("users").doc(currentUid).collection("following").doc(targetUid).get(),
//       db.collection("users").doc(targetUid).collection("followRequests").doc(currentUid).get(),
//       db.collection("users").doc(targetUid).collection("following").doc(currentUid).get(),
//     ]);

//     // Determine if the target user follows the current user but is not followed back
//     const isFollowingWithoutFollowback = followedByStatus.exists && !followingStatus.exists;

//     // Return only the specified fields with null coalescing
//     return NextResponse.json({
//       username: userData.username,
//       displayName: userData.displayName ?? null,
//       isVerified: userData.isVerified ?? false,
//       isPrivate: userData.isPrivate ?? false,
//       createdAt: userData.createdAt ?? null,
//       bio: userData.bio ?? null,
//       profilePhotoURL: userData.profilePhotoURL ?? null,
//       uid: targetUid,
//       followerCount: userData.followerCount ?? 0,
//       followingCount: userData.followingCount ?? 0,
//       isFollowing: followingStatus.exists,
//       isRequested: requestStatus.exists,
//       isFollowingWithoutFollowback,
//     });
//   } catch (error) {
//     console.error("Error in profile API:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }




//src/app/api/user-profile/query/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedToken = (await verifyJWT(token)) as CustomJWTPayload;
    if (!decodedToken.uid) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

    const currentUid = decodedToken.uid;
    
    // Use indexed query for username lookup
    const userQuery = db.collection("users").where("username", "==", username).limit(1);
    const userSnapshot = await userQuery.get();
    if (userSnapshot.empty) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const targetUserDoc = userSnapshot.docs[0];
    const targetUid = targetUserDoc.id;
    const userData = targetUserDoc.data();

    // Fetch relationships using indexed queries
    const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
      db.collection(`users/${currentUid}/following`).doc(targetUid).get(),
      db.collection(`users/${targetUid}/followRequests`).doc(currentUid).get(),
      db.collection(`users/${targetUid}/following`).doc(currentUid).get(),
    ]);

    return NextResponse.json({
      username: userData.username,
      displayName: userData.displayName,
      isVerified: userData.isVerified ?? false,
      isPrivate: userData.isPrivate ?? false,
      createdAt: userData.createdAt,
      bio: userData.bio,
      profilePhotoURL: userData.profilePhotoURL,
      uid: targetUid,
      followerCount: userData.followerCount ?? 0,
      followingCount: userData.followingCount ?? 0,
      isFollowing: followingStatus.exists,
      isRequested: requestStatus.exists,
      isFollowingWithoutFollowback: followedByStatus.exists && !followingStatus.exists,
    });
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}