
// src/app/api/user-profile-public/route.ts
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

    // Get target user data
    const userQuery = await db.collection("users")
      .where("username", "==", username)
      .get();

    if (userQuery.empty) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUserDoc = userQuery.docs[0];
    const targetUid = targetUserDoc.id;
    const targetUserData = targetUserDoc.data();

    // Check for blocks in both directions
    const currentUserBlocked = await db
      .collection("blocks")
      .doc(decodedToken.uid)
      .collection("blocked")
      .doc(targetUid)
      .get();

    const targetUserBlocked = await db
      .collection("blocks")
      .doc(targetUid)
      .collection("blocked")
      .doc(decodedToken.uid)
      .get();

    // Handle blocking scenarios
    if (targetUserBlocked.exists) {
      return NextResponse.json(
        { error: "Content not available" },
        { status: 403 }
      );
    }

    if (currentUserBlocked.exists) {
      return NextResponse.json({
        username: targetUserData.username,
        displayName: targetUserData.displayName,
        profilePhotoURL: targetUserData.profilePhotoURL,
        blocked: true
      });
    }

    // Return full user data if no blocks exist
    return NextResponse.json({
      ...targetUserData,
      uid: targetUid
    });

  } catch (error) {
    console.error("Error in public profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}