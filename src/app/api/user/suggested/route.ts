//app/api/user/suggested/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET() {
  try {
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

    // Get current user's blocked users
    const blockedUsersSnapshot = await db.collection("users")
      .doc(currentUid)
      .collection("blocked")
      .get();
    
    const blockedUids = blockedUsersSnapshot.docs.map(doc => doc.id);

    // Get random users excluding current user and blocked users
    const usersSnapshot = await db.collection("users")
      .where("uid", "!=", currentUid)
      .limit(5)
      .get();

    const users = await Promise.all(
      usersSnapshot.docs
        .filter(doc => !blockedUids.includes(doc.id))
        .slice(0, 5)
        .map(async (doc) => {
          const userData = doc.data();
          const followingStatus = await db.collection("users")
            .doc(currentUid)
            .collection("following")
            .doc(doc.id)
            .get();

          const followRequestStatus = userData.isPrivate ? await db.collection("users")
            .doc(doc.id)
            .collection("followRequests")
            .doc(currentUid)
            .get() : null;

          return {
            uid: doc.id,
            username: userData.username,
            displayName: userData.displayName,
            profilePhotoURL: userData.profilePhotoURL,
            isVerified: userData.isVerified,
            isPrivate: userData.isPrivate,
            isFollowing: followingStatus.exists,
            isRequested: followRequestStatus?.exists || false,
          };
        })
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


