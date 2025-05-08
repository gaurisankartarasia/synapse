// src/app/api/v1/user-profile/me/route.ts
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

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json({
      username: userData?.username,
      displayName: userData?.displayName,
      bio: userData?.bio,
      profilePhotoURL: userData?.profilePhotoURL,
      lastEditedAt: userData?.lastEditedAt,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
