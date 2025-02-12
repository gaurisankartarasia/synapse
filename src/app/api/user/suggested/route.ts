// app/api/suggestions/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET() {
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

    // Get random users excluding current user
    const usersSnapshot = await db.collection("users")
      .where("uid", "!=", currentUid)
      .limit(5) // Adjust limit as needed
      .get();

    const users = await Promise.all(
      usersSnapshot.docs.map(async (doc) => {
        const userData = doc.data();
        const followingStatus = await db.collection("users")
          .doc(currentUid)
          .collection("following")
          .doc(doc.id)
          .get();

        return {
          uid: doc.id,
          username: userData.username,
          displayName: userData.displayName,
          profilePhotoURL: userData.profilePhotoURL,
          isVerified:userData.isVerified,
          isFollowing: followingStatus.exists,
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
