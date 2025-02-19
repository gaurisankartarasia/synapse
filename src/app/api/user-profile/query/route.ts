//src/app/api/user-profile/query/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    // Get and verify token
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }
    const currentUid = decodedToken.uid;

    // Get target user data
    const userQuery = await db.collection("users")
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
    const userData = targetUserDoc.data();

    // Get following status in parallel
    const [followingStatus, requestStatus] = await Promise.all([
      db.collection("users")
        .doc(currentUid)
        .collection("following")
        .doc(targetUid)
        .get(),
      db.collection("users")
        .doc(targetUid)
        .collection("followRequests")
        .doc(currentUid)
        .get()
    ]);

    // Return only the specified fields
    return NextResponse.json({
      username: userData.username,
      displayName: userData.displayName,
      isVerified: userData.isVerified ?? false,
      isPrivate: userData.isPrivate ?? false,
      createdAt: userData.createdAt,
      profilePhotoURL: userData.profilePhotoURL,
      uid: targetUid,
      followerCount: userData.followerCount ?? 0,
      followingCount: userData.followingCount ?? 0,
      isFollowing: followingStatus.exists,
      isRequested: requestStatus.exists,
    });
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



