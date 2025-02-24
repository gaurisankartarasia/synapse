// src/app/api/user-profile/update/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function PUT(request: Request) {
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
    const body = await request.json();

    const userRef = db.collection("users").doc(decodedToken.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check username uniqueness if changed
    if (body.username !== userData?.username) {
      const usernameCheck = await db
        .collection("users")
        .where("username", "==", body.username)
        .get();
      if (!usernameCheck.empty) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Update profile with edit tracking
    await userRef.update({
      username: body.username,
      displayName: body.displayName,
      bio: body.bio,
      profilePhotoURL: body.profilePhotoURL,
      lastEditedAt: new Date(),
      editCount: (userData?.editCount || 0) + 1,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}