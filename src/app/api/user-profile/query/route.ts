
// //src/app/api/user-profile/query/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const username = searchParams.get("username");
//     if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const decodedToken = (await verifyJWT(token)) as CustomJWTPayload;
//     if (!decodedToken.uid) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

//     const currentUid = decodedToken.uid;
    
//     // Use indexed query for username lookup
//     const userQuery = db.collection("users").where("username", "==", username).limit(1);
//     const userSnapshot = await userQuery.get();
//     if (userSnapshot.empty) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     const targetUserDoc = userSnapshot.docs[0];
//     const targetUid = targetUserDoc.id;
//     const userData = targetUserDoc.data();

//     // Fetch relationships using indexed queries
//     const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
//       db.collection(`users/${currentUid}/following`).doc(targetUid).get(),
//       db.collection(`users/${targetUid}/followRequests`).doc(currentUid).get(),
//       db.collection(`users/${targetUid}/following`).doc(currentUid).get(),
//     ]);

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
//       isFollowingWithoutFollowback: followedByStatus.exists && !followingStatus.exists,
//     });
//   } catch (error) {
//     console.error("Error in profile API:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = (await verifyJWT(token)) as CustomJWTPayload;
    if (!decodedToken.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const currentUid = decodedToken.uid;

    // Query user by username
    const userQuery = db.collection("users").where("username", "==", username).limit(1);
    const userSnapshot = await userQuery.get();
    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserDoc = userSnapshot.docs[0];
    const targetUid = targetUserDoc.id;
    const userData = targetUserDoc.data();

    // Check if either user has blocked the other
    const [currentUserBlockedTarget, targetUserBlockedCurrent] = await Promise.all([
      db.collection(`users/${currentUid}/blocked`).doc(targetUid).get(),
      db.collection(`users/${targetUid}/blocked`).doc(currentUid).get(),
    ]);

    if (currentUserBlockedTarget.exists || targetUserBlockedCurrent.exists) {
      return NextResponse.json({ error: "User is unavailable" }, { status: 403 });
    }

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
      account_type: userData?.account_type,
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
